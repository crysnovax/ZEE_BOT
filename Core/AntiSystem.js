/**
 * ╔══════════════════════════════════════════════════╗
 * ║          Core/AntiSystem.js - ZEE BOT            ║
 * ║         Anti-Spam Protection System              ║
 * ╚══════════════════════════════════════════════════╝
 */

const chalk = require('chalk');
const config = require('../config');
const { isAdmin, isBotAdmin } = require('./PermissionChecker');
const Database = require('./Database');

// Spam tracking
const spamTracker = new Map();

/**
 * Run all anti-spam systems
 * @returns {boolean} - true if message should be blocked
 */
async function runAntiSystems(sock, msg) {
    try {
        // Skip if user is admin or owner
        const userIsAdmin = await isAdmin(msg.sender, msg.from, sock);
        if (userIsAdmin) return false;
        
        let shouldBlock = false;
        
        // Anti-link check
        if (config.antiSystems.antiLink.enabled) {
            const linkDetected = await checkAntiLink(sock, msg);
            if (linkDetected) shouldBlock = true;
        }
        
        // Anti-tag check
        if (config.antiSystems.antiTag.enabled) {
            const tagViolation = await checkAntiTag(sock, msg);
            if (tagViolation) shouldBlock = true;
        }
        
        // Anti-spam check
        if (config.antiSystems.antiSpam.enabled) {
            const spamDetected = await checkAntiSpam(sock, msg);
            if (spamDetected) shouldBlock = true;
        }
        
        return shouldBlock;
        
    } catch (error) {
        console.log(chalk.red('[ANTI-SYSTEM ERROR]'), error);
        return false;
    }
}

/**
 * Anti-link system
 */
async function checkAntiLink(sock, msg) {
    const groupSettings = await Database.getGroupSettings(msg.from);
    if (!groupSettings.antiLink) return false;
    
    const text = msg.text || '';
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|net|org|io|me|co|xyz|info|app)[^\s]*)/gi;
    const links = text.match(urlRegex);
    
    if (links) {
        // Check whitelist
        const isWhitelisted = links.some(link => 
            config.antiSystems.antiLink.whitelist.some(domain => link.includes(domain))
        );
        
        if (!isWhitelisted) {
            console.log(chalk.yellow(`[ANTI-LINK] Blocked link from ${msg.pushName}`));
            
            const action = config.antiSystems.antiLink.action;
            
            if (action === 'delete') {
                await msg.delete();
                await msg.reply('❌ Links are not allowed in this group!');
            } else if (action === 'warn') {
                await msg.reply(`⚠️ @${msg.sender.split('@')[0]}, links are not allowed!`, {
                    mentions: [msg.sender]
                });
            } else if (action === 'kick') {
                const botIsAdmin = await isBotAdmin(msg.from, sock);
                if (botIsAdmin) {
                    await sock.groupParticipantsUpdate(msg.from, [msg.sender], 'remove');
                    await msg.reply(`👋 @${msg.sender.split('@')[0]} was removed for posting links!`, {
                        mentions: [msg.sender]
                    });
                } else {
                    await msg.reply('⚠️ Links are not allowed! (Bot needs admin to remove users)');
                }
            }
            
            return true;
        }
    }
    
    return false;
}

/**
 * Anti-tag system
 */
async function checkAntiTag(sock, msg) {
    const groupSettings = await Database.getGroupSettings(msg.from);
    if (!groupSettings.antiTag) return false;
    
    const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentions.length > config.antiSystems.antiTag.maxTags) {
        console.log(chalk.yellow(`[ANTI-TAG] Blocked mass tag from ${msg.pushName} (${mentions.length} tags)`));
        
        const action = config.antiSystems.antiTag.action;
        
        if (action === 'delete') {
            await msg.delete();
            await msg.reply(`❌ Mass tagging is not allowed! Maximum ${config.antiSystems.antiTag.maxTags} tags per message.`);
        } else if (action === 'warn') {
            await msg.reply(`⚠️ @${msg.sender.split('@')[0]}, please don't mass tag (max ${config.antiSystems.antiTag.maxTags} tags)!`, {
                mentions: [msg.sender]
            });
        } else if (action === 'kick') {
            const botIsAdmin = await isBotAdmin(msg.from, sock);
            if (botIsAdmin) {
                await sock.groupParticipantsUpdate(msg.from, [msg.sender], 'remove');
                await msg.reply(`👋 @${msg.sender.split('@')[0]} was removed for mass tagging!`, {
                    mentions: [msg.sender]
                });
            } else {
                await msg.reply('⚠️ Mass tagging not allowed! (Bot needs admin to remove users)');
            }
        }
        
        return true;
    }
    
    return false;
}

/**
 * Anti-spam system (flood protection)
 */
async function checkAntiSpam(sock, msg) {
    const groupSettings = await Database.getGroupSettings(msg.from);
    if (!groupSettings.antiSpam) return false;
    
    const userId = msg.sender;
    const now = Date.now();
    
    // Initialize spam tracker for user
    if (!spamTracker.has(userId)) {
        spamTracker.set(userId, []);
    }
    
    const userMessages = spamTracker.get(userId);
    
    // Remove old messages outside time window
    const validMessages = userMessages.filter(time => 
        now - time < config.antiSystems.antiSpam.timeWindow
    );
    
    // Add current message
    validMessages.push(now);
    spamTracker.set(userId, validMessages);
    
    // Check if spam threshold exceeded
    if (validMessages.length > config.antiSystems.antiSpam.maxMessages) {
        console.log(chalk.yellow(`[ANTI-SPAM] Detected spam from ${msg.pushName} (${validMessages.length} messages)`));
        
        const action = config.antiSystems.antiSpam.action;
        
        if (action === 'warn') {
            await msg.reply(`⚠️ @${msg.sender.split('@')[0]}, please slow down! You're sending too many messages.`, {
                mentions: [msg.sender]
            });
        } else if (action === 'kick') {
            const botIsAdmin = await isBotAdmin(msg.from, sock);
            if (botIsAdmin) {
                await sock.groupParticipantsUpdate(msg.from, [msg.sender], 'remove');
                await msg.reply(`👋 @${msg.sender.split('@')[0]} was removed for spamming!`, {
                    mentions: [msg.sender]
                });
            } else {
                await msg.reply('⚠️ Spamming detected! (Bot needs admin to remove users)');
            }
        }
        
        // Clear spam tracker for user
        spamTracker.delete(userId);
        
        return true;
    }
    
    return false;
}

// Clean up spam tracker every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [userId, messages] of spamTracker.entries()) {
        const validMessages = messages.filter(time => 
            now - time < config.antiSystems.antiSpam.timeWindow
        );
        if (validMessages.length === 0) {
            spamTracker.delete(userId);
        } else {
            spamTracker.set(userId, validMessages);
        }
    }
}, 300000); // 5 minutes

module.exports = {
    runAntiSystems,
    checkAntiLink,
    checkAntiTag,
    checkAntiSpam
};
