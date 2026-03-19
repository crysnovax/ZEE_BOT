/**
 * ╔══════════════════════════════════════════════════╗
 * ║        Core/PluginLoader.js - ZEE BOT            ║
 * ║           Plugin Management System               ║
 * ╚══════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const commands = new Map();

/**
 * Load all plugins from Plugins directory
 */
async function loadPlugins() {
    const pluginsPath = path.join(__dirname, '../Plugins');
    
    if (!fs.existsSync(pluginsPath)) {
        fs.mkdirSync(pluginsPath, { recursive: true });
        console.log(chalk.yellow('📁 Created Plugins directory'));
        return;
    }
    
    const files = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));
    
    for (const file of files) {
        try {
            const plugin = require(path.join(pluginsPath, file));
            
            if (plugin.command && plugin.execute) {
                const aliases = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
                
                for (const alias of aliases) {
                    commands.set(alias.toLowerCase(), plugin);
                }
                
                console.log(chalk.green(`✅ Loaded plugin: ${file} (${aliases.join(', ')})`));
            }
        } catch (error) {
            console.log(chalk.red(`❌ Failed to load ${file}:`), error.message);
        }
    }
    
    console.log(chalk.cyan(`\n📦 Loaded ${commands.size} commands from ${files.length} plugins\n`));
}

/**
 * Get command handler
 */
function getCommand(commandName) {
    return commands.get(commandName.toLowerCase());
}

/**
 * Execute command
 */
async function executeCommand(commandName, sock, msg, args) {
    const command = getCommand(commandName);
    if (command && command.execute) {
        await command.execute(sock, msg, args);
    }
}

/**
 * Get all commands
 */
function getAllCommands() {
    return Array.from(commands.values());
}

module.exports = {
    loadPlugins,
    getCommand,
    executeCommand,
    getAllCommands
};
