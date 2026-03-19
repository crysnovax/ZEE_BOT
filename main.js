/**
 * ╔══════════════════════════════════════════════════╗
 * ║            ZEE BOT - Professional Edition        ║
 * ║        Powered by CRYSNOVA AI Technology         ║
 * ║              Rock-Solid Architecture             ║
 * ╚══════════════════════════════════════════════════╝
 * 
 * @author CRYSNOVA
 * @version 1.0.0
 * @description Professional WhatsApp bot with clean architecture
 */

require('dotenv').config();
const pino = require('pino');
const chalk = require('chalk');
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys');

// Core imports
const config = require('./config');
const { initializeConnection } = require('./Core/Connection');
const { handleMessage } = require('./Core/MessageHandler');
const { loadPlugins } = require('./Core/PluginLoader');
const Database = require('./Core/Database');

// Banner
console.clear();
console.log(chalk.cyan(`
╔══════════════════════════════════════════════════╗
║  ███████╗███████╗███████╗    ██████╗  ██████╗ ████████╗║
║  ╚══███╔╝██╔════╝██╔════╝    ██╔══██╗██╔═══██╗╚══██╔══╝║
║    ███╔╝ █████╗  █████╗      ██████╔╝██║   ██║   ██║   ║
║   ███╔╝  ██╔══╝  ██╔══╝      ██╔══██╗██║   ██║   ██║   ║
║  ███████╗███████╗███████╗    ██████╔╝╚██████╔╝   ██║   ║
║  ╚══════╝╚══════╝╚══════╝    ╚═════╝  ╚═════╝    ╚═╝   ║
╚══════════════════════════════════════════════════╝
`));
console.log(chalk.yellow.bold('         Powered by CRYSNOVA AI Technology'));
console.log(chalk.green.bold('         Professional WhatsApp Bot v1.0.0\n'));

// Global error handlers
process.on('unhandledRejection', (err) => {
    console.log(chalk.red('[UNHANDLED REJECTION]'), err);
});

process.on('uncaughtException', (err) => {
    console.log(chalk.red('[UNCAUGHT EXCEPTION]'), err);
});

// Main function
async function startZeeBot() {
    try {
        console.log(chalk.cyan('🚀 Starting ZEE BOT...'));
        
        // Initialize database
        console.log(chalk.cyan('📊 Initializing database...'));
        await Database.initialize();
        
        // Load plugins
        console.log(chalk.cyan('🔌 Loading plugins...'));
        await loadPlugins();
        
        // Start connection
        console.log(chalk.cyan('🔗 Establishing WhatsApp connection...'));
        await initializeConnection();
        
    } catch (error) {
        console.log(chalk.red('❌ Fatal error during startup:'), error);
        process.exit(1);
    }
}

// Start the bot
startZeeBot();
