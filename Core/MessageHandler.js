/**
 * ╔══════════════════════════════════════════════════╗
 * ║         Core/MessageHandler.js - ZEE BOT         ║
 * ║           Main Message Processing Engine         ║
 * ╚══════════════════════════════════════════════════╝
 */

const chalk = require('chalk');
const config = require('../config');
const { serialize } = require('../lib/serialize');
const { checkPermission } = require('./PermissionChecker');
const { runAntiSystems } = require('./AntiSystem');
const { handleAutoReply } = require('./AutoReply');
const { getCommand, executeCommand } = require('./PluginLoader');
const Database = require('./Database');

/**
 * Handle incoming messages
 */
async function handleMessage(sock, rawMessage) {
    try {
        // Serialize message for easier handling
        const msg = await serialize(sock, rawMessage);
        
        // Ignore if no message content
        if (!msg.message) return;
        
        // Ignore broadcast messages
        if (msg.key.remoteJid === 'status@broadcast') return;
        
        // Log message (if enabled)
        if (config.logging.logMessages) {
            console.log(chalk.gray(`[${msg.isGroup ? 'GROUP' : 'PM'}] ${msg.pushName}: ${msg.text || '[Media]'}`));
        }
        
        // Extract basic info
        const sender = msg.sender;
        const isGroup = msg.isGroup;
        const body = msg.text || '';
        const command = body.startsWith(config.prefix) ? body.slice(config.prefix.length).trim().split(/\s+/)[0].toLowerCase() : null;
        const args = body.slice(config.prefix.length + (command?.length || 0)).trim().split(/\s+/);
        
        // Check if sender is banned
        if (config.permissions.banned.includes(sender)) {
            return; // Silently ignore banned users
        }
        
        // Check bot mode (public/private)
        if (!config.mode.public) {
            const hasPermission = await checkPermission(sender, 'owner');
            if (!hasPermission) return;
        }
        
        // Self-bot mode (only respond to owner)
        if (config.mode.selfBot) {
            const isOwner = await checkPermission(sender, 'owner');
            if (!isOwner) return;
        }
        
        // Run anti-spam systems (if in group)
        if (isGroup) {
            const shouldBlock = await runAntiSystems(sock, msg);
            if (shouldBlock) return; // Message blocked by anti-system
        }
        
        // Handle commands
        if (command) {
            try {
                // Log command execution
                if (config.logging.logCommands) {
                    console.log(chalk.green(`[COMMAND] ${msg.pushName}: ${config.prefix}${command}`));
                }
                
                // Get command handler
                const cmdHandler = getCommand(command);
                
                if (cmdHandler) {
                    // Check command permissions
                    if (cmdHandler.permission) {
                        const hasPermission = await checkPermission(sender, cmdHandler.permission);
                        if (!hasPermission) {
                            return await msg.reply('❌ You don\'t have permission to use this command!');
                        }
                    }
                    
                    // Check if command is group-only
                    if (cmdHandler.groupOnly && !isGroup) {
                        return await msg.reply('❌ This command can only be used in groups!');
                    }
                    
                    // Check if command is DM-only
                    if (cmdHandler.privateOnly && isGroup) {
                        return await msg.reply('❌ This command can only be used in private chat!');
                    }
                    
                    // Execute command
                    await executeCommand(command, sock, msg, args);
                    
                    // Update command usage stats
                    await Database.incrementCommandUsage(command);
                    
                } else {
                    // Command not found - might trigger auto-reply
                    if (config.autoReply.enabled && !isGroup) {
                        await handleAutoReply(sock, msg);
                    }
                }
            } catch (error) {
                console.log(chalk.red('[COMMAND ERROR]'), error);
                await msg.reply('❌ An error occurred while executing this command.');
            }
        } else {
            // No command - check for auto-reply
            if (config.autoReply.enabled) {
                await handleAutoReply(sock, msg);
            }
        }
        
    } catch (error) {
        console.log(chalk.red('[MESSAGE HANDLER ERROR]'), error);
    }
}

module.exports = {
    handleMessage
};
