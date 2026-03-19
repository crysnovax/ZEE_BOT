/**
 * ╔══════════════════════════════════════════════════╗
 * ║          Core/AutoReply.js - ZEE BOT             ║
 * ║          AI-Powered Auto-Reply System            ║
 * ╚══════════════════════════════════════════════════╝
 */

const chalk = require('chalk');
const config = require('../config');
const Database = require('./Database');

/**
 * Handle auto-reply with AI
 */
async function handleAutoReply(sock, msg) {
    try {
        const text = msg.text || '';
        if (!text.trim()) return;
        
        // Check if AI auto-reply is enabled
        if (!config.autoReply.ai.enabled) {
            return await handleGreetings(sock, msg);
        }
        
        // Get conversation memory
        const chatId = msg.from;
        const memory = await Database.getAIMemory(chatId);
        
        // Add current message to memory
        memory.push({
            role: 'user',
            content: text
        });
        
        // Limit memory to max messages
        if (memory.length > config.autoReply.ai.maxMemory * 2) {
            memory.splice(0, memory.length - (config.autoReply.ai.maxMemory * 2));
        }
        
        // Build conversation context
        const conversation = memory.map(m => 
            m.role === 'user' ? `User: ${m.content}` : `Bot: ${m.content}`
        ).join('\n');
        
        const aiPrompt = `${conversation}\nBot:`;
        
        // Call AI API
        try {
            const response = await fetch(
                `${config.autoReply.ai.apiUrl}?query=${encodeURIComponent(aiPrompt)}&model=${config.autoReply.ai.model}`
            );
            
            if (!response.ok) {
                throw new Error('AI API request failed');
            }
            
            const data = await response.json();
            const aiReply = data.response || data.result || "I couldn't process that. Please try again.";
            
            // Add AI response to memory
            memory.push({
                role: 'assistant',
                content: aiReply
            });
            
            // Save updated memory
            await Database.saveAIMemory(chatId, memory);
            
            // Send reply
            await msg.reply(aiReply);
            
            console.log(chalk.green(`[AUTO-REPLY] AI response sent to ${msg.pushName}`));
            
        } catch (error) {
            console.log(chalk.red('[AI ERROR]'), error.message);
            await handleGreetings(sock, msg); // Fallback to simple greetings
        }
        
    } catch (error) {
        console.log(chalk.red('[AUTO-REPLY ERROR]'), error);
    }
}

/**
 * Handle simple greetings
 */
async function handleGreetings(sock, msg) {
    if (!config.autoReply.greetings.enabled) return;
    
    const text = msg.text.toLowerCase();
    const keywords = config.autoReply.greetings.keywords;
    
    const containsGreeting = keywords.some(keyword => text.includes(keyword));
    
    if (containsGreeting) {
        await msg.reply(config.autoReply.greetings.response);
        console.log(chalk.green(`[AUTO-REPLY] Greeting sent to ${msg.pushName}`));
    }
}

module.exports = {
    handleAutoReply,
    handleGreetings
};
