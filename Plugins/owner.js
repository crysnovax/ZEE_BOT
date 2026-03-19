/**
 * Owner Commands - Bot management
 */

const config = require('../config');
const { getCommandStats } = require('../Core/Database');

module.exports = {
    command: ['stats', 'status'],
    description: 'Show bot statistics',
    category: 'owner',
    permission: 'owner',
    
    async execute(sock, msg, args) {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const stats = await getCommandStats();
        const totalCommands = Object.values(stats).reduce((a, b) => a + b, 0);
        
        const statsText = `╔══════════════════════════════════╗\n` +
                         `║      ZEE BOT Statistics          ║\n` +
                         `╚══════════════════════════════════╝\n\n` +
                         `⏰ Uptime: ${hours}h ${minutes}m ${seconds}s\n` +
                         `📊 Commands Executed: ${totalCommands}\n` +
                         `🤖 Bot: ${sock.user.name}\n` +
                         `📱 Number: ${sock.user.id.split(':')[0]}\n\n` +
                         `${config.branding.footer}`;
        
        await msg.reply(statsText);
    }
};
