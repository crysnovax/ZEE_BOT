/**
 * ╔══════════════════════════════════════════════════╗
 * ║        Core/GroupHandler.js - ZEE BOT            ║
 * ║           Group Events Management                ║
 * ╚══════════════════════════════════════════════════╝
 */

const config = require('../config');
const Database = require('./Database');

async function handleGroupUpdate(sock, update) {
    try {
        const { id, participants, action } = update;
        
        const groupSettings = await Database.getGroupSettings(id);
        const groupMetadata = await sock.groupMetadata(id);
        
        for (const participant of participants) {
            if (action === 'add' && groupSettings.welcome) {
                const message = config.groupFeatures.welcome.message
                    .replace('{group}', groupMetadata.subject)
                    .replace('{user}', participant.split('@')[0])
                    .replace('{count}', groupMetadata.participants.length);
                
                await sock.sendMessage(id, {
                    text: message,
                    mentions: [participant]
                });
            } else if (action === 'remove' && groupSettings.goodbye) {
                const message = config.groupFeatures.goodbye.message
                    .replace('{user}', participant.split('@')[0])
                    .replace('{count}', groupMetadata.participants.length);
                
                await sock.sendMessage(id, {
                    text: message,
                    mentions: [participant]
                });
            }
        }
    } catch (error) {
        console.log('[GROUP HANDLER ERROR]', error);
    }
}

module.exports = { handleGroupUpdate };
