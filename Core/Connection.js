/**
 * ╔══════════════════════════════════════════════════╗
 * ║           Core/Connection.js - ZEE BOT           ║
 * ║         WhatsApp Connection Management           ║
 * ╚══════════════════════════════════════════════════╝
 */

const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const config = require('../config');
const { handleMessage } = require('./MessageHandler');
const { handleGroupUpdate } = require('./GroupHandler');

let sock = null;
let isConnected = false;

/**
 * Initialize WhatsApp connection
 */
async function initializeConnection() {
    const { state, saveCreds } = await useMultiFileAuthState(`./${config.sessionName}`);
    const { version } = await fetchLatestBaileysVersion();
    
    sock = makeWASocket({
        version,
        logger: pino({ level: config.logging.level }),
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: config.logging.level }))
        },
        browser: Browsers.macOS('Safari'),
        markOnlineOnConnect: config.mode.alwaysOnline,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            return {
                conversation: 'ZEE BOT'
            };
        }
    });
    
    // Store authentication state
    sock.ev.on('creds.update', saveCreds);
    
    // Connection events
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            
            console.log(chalk.red('❌ Connection closed'));
            console.log(chalk.yellow('Reason:'), lastDisconnect?.error);
            
            isConnected = false;
            
            if (shouldReconnect) {
                console.log(chalk.cyan('🔄 Reconnecting...'));
                setTimeout(() => initializeConnection(), 3000);
            } else {
                console.log(chalk.red('🚫 Logged out. Please scan QR code again.'));
                process.exit(0);
            }
        } else if (connection === 'open') {
            isConnected = true;
            
            console.log(chalk.green('✅ Connected to WhatsApp!'));
            console.log(chalk.cyan(`📱 Bot Number: ${sock.user.id.split(':')[0]}`));
            console.log(chalk.cyan(`👤 Bot Name: ${sock.user.name || 'Unknown'}`));
            console.log(chalk.cyan(`🔧 Prefix: ${config.prefix}`));
            console.log(chalk.green(`🌍 Mode: ${config.mode.public ? 'Public' : 'Private'}`));
            console.log(chalk.yellow('\n🤖 ZEE BOT is now online!\n'));
            
            // Send startup message to owner
            try {
                await sock.sendMessage(config.permissions.owners[0], {
                    text: `╔══════════════════════════════════╗\n` +
                          `║  ✅ ZEE BOT Connected!          ║\n` +
                          `╠══════════════════════════════════╣\n` +
                          `║  📱 Number: ${sock.user.id.split(':')[0]}\n` +
                          `║  🔧 Prefix: ${config.prefix}\n` +
                          `║  🌍 Mode: ${config.mode.public ? 'Public' : 'Private'}\n` +
                          `║  🤖 Status: Online\n` +
                          `╚══════════════════════════════════╝\n\n` +
                          `Powered by CRYSNOVA AI 🔥`
                });
            } catch (error) {
                console.log(chalk.yellow('⚠️  Could not send startup message to owner'));
            }
        } else if (connection === 'connecting') {
            console.log(chalk.yellow('🔄 Connecting to WhatsApp...'));
        }
    });
    
    // Message events
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        
        for (const message of messages) {
            try {
                await handleMessage(sock, message);
            } catch (error) {
                console.log(chalk.red('[MESSAGE ERROR]'), error);
            }
        }
    });
    
    // Group events
    sock.ev.on('group-participants.update', async (update) => {
        try {
            await handleGroupUpdate(sock, update);
        } catch (error) {
            console.log(chalk.red('[GROUP UPDATE ERROR]'), error);
        }
    });
    
    // Auto-read messages
    if (config.mode.autoRead) {
        sock.ev.on('messages.upsert', async ({ messages }) => {
            for (const msg of messages) {
                if (msg.key && msg.key.remoteJid) {
                    await sock.readMessages([msg.key]);
                }
            }
        });
    }
    
    return sock;
}

/**
 * Get socket instance
 */
function getSocket() {
    return sock;
}

/**
 * Check if bot is connected
 */
function getConnectionStatus() {
    return isConnected;
}

module.exports = {
    initializeConnection,
    getSocket,
    getConnectionStatus
};
