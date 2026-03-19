/**
 * Menu Command - Show all available commands
 */

const config = require('../config');
const { getAllCommands } = require('../Core/PluginLoader');

module.exports = {
    command: ['menu', 'help'],
    description: 'Show all available commands',
    category: 'general',
    
    async execute(sock, msg, args) {
        const commands = getAllCommands();
        
        // Group commands by category
        const categories = {};
        commands.forEach(cmd => {
            const category = cmd.category || 'other';
            if (!categories[category]) categories[category] = [];
            
            const cmdName = Array.isArray(cmd.command) ? cmd.command[0] : cmd.command;
            categories[category].push({
                name: cmdName,
                desc: cmd.description || 'No description'
            });
        });
        
        let menuText = `╔══════════════════════════════════╗\n`;
        menuText += `║        ZEE BOT - Menu             ║\n`;
        menuText += `╚══════════════════════════════════╝\n\n`;
        menuText += `👤 User: ${msg.pushName}\n`;
        menuText += `🔧 Prefix: ${config.prefix}\n`;
        menuText += `📦 Commands: ${commands.length}\n\n`;
        
        for (const [category, cmds] of Object.entries(categories)) {
            menuText += `┏━━━ *${category.toUpperCase()}* ━━━\n`;
            cmds.forEach(cmd => {
                menuText += `┃ ${config.prefix}${cmd.name}\n`;
                menuText += `┃   ↳ ${cmd.desc}\n`;
            });
            menuText += `┗━━━━━━━━━━━━━━━━\n\n`;
        }
        
        menuText += `${config.branding.footer}`;
        
        await msg.reply(menuText);
    }
};
