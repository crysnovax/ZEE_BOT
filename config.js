/**
 * ╔══════════════════════════════════════════════════╗
 * ║              ZEE BOT - Configuration             ║
 * ║         Powered by CRYSNOVA AI Technology        ║
 * ╚══════════════════════════════════════════════════╝
 */

module.exports = {
    // ════════════════════════════════════════════════
    // BOT INFORMATION
    // ════════════════════════════════════════════════
    botName: process.env.BOT_NAME || 'ZEE BOT',
    botOwner: process.env.OWNER_NUMBER || '2347043550282',
    prefix: process.env.PREFIX || '.',
    
    // ════════════════════════════════════════════════
    // SESSION & DATABASE
    // ════════════════════════════════════════════════
    sessionName: process.env.SESSION_NAME || 'zee-session',
    databasePath: './database',
    
    // ════════════════════════════════════════════════
    // BOT MODE
    // ════════════════════════════════════════════════
    mode: {
        public: process.env.PUBLIC_MODE === 'true' || false,
        selfBot: process.env.SELF_BOT === 'true' || false,
        autoRead: process.env.AUTO_READ === 'true' || true,
        autoTyping: process.env.AUTO_TYPING === 'true' || false,
        autoRecording: process.env.AUTO_RECORDING === 'true' || false,
        alwaysOnline: process.env.ALWAYS_ONLINE === 'true' || true
    },
    
    // ════════════════════════════════════════════════
    // PERMISSIONS
    // ════════════════════════════════════════════════
    permissions: {
        // Owner numbers (full access)
        owners: process.env.OWNER_NUMBERS 
            ? process.env.OWNER_NUMBERS.split(',').map(n => n.trim() + '@s.whatsapp.net')
            : ['2347043550282@s.whatsapp.net'],
        
        // Premium users (special features)
        premium: [],
        
        // Banned users (blocked from using bot)
        banned: []
    },
    
    // ════════════════════════════════════════════════
    // AUTO REPLY SYSTEM
    // ════════════════════════════════════════════════
    autoReply: {
        enabled: process.env.AUTO_REPLY === 'true' || true,
        
        // AI-powered replies (CRYSNOVA AI)
        ai: {
            enabled: true,
            apiUrl: 'https://all-in-1-ais.officialhectormanuel.workers.dev/',
            model: 'gpt-4.5-preview',
            maxMemory: 10 // messages per chat
        },
        
        // Greeting replies
        greetings: {
            enabled: true,
            keywords: ['hi', 'hello', 'hey', 'morning', 'afternoon', 'evening'],
            response: 'Hello! 👋 How can I help you today?'
        }
    },
    
    // ════════════════════════════════════════════════
    // ANTI-SPAM SYSTEMS
    // ════════════════════════════════════════════════
    antiSystems: {
        // Anti-link (remove links)
        antiLink: {
            enabled: true,
            action: 'delete', // 'delete', 'warn', 'kick'
            whitelist: ['chat.whatsapp.com'] // Allowed domains
        },
        
        // Anti-tag (prevent mass tagging)
        antiTag: {
            enabled: true,
            maxTags: 5, // Max mentions per message
            action: 'warn' // 'delete', 'warn', 'kick'
        },
        
        // Anti-spam (flood protection)
        antiSpam: {
            enabled: true,
            maxMessages: 10, // Max messages
            timeWindow: 10000, // Within 10 seconds
            action: 'warn'
        }
    },
    
    // ════════════════════════════════════════════════
    // GROUP FEATURES
    // ════════════════════════════════════════════════
    groupFeatures: {
        // Welcome new members
        welcome: {
            enabled: true,
            message: '┏━━━━〔 Welcome to {group} 〕━━━━\n' +
                     '❏┃ Hello @{user}!\n' +
                     '❏┃ Members: {count}\n' +
                     '❏┃ Read the group description!\n' +
                     '┗━━━━━━━━━━━━━━━━━━━━━'
        },
        
        // Goodbye leaving members
        goodbye: {
            enabled: true,
            message: '👋 @{user} left the group\n' +
                     'Members: {count}'
        },
        
        // Anti-delete (save deleted messages)
        antiDelete: {
            enabled: false
        }
    },
    
    // ════════════════════════════════════════════════
    // LOGGING & DEBUG
    // ════════════════════════════════════════════════
    logging: {
        level: process.env.LOG_LEVEL || 'info', // 'silent', 'error', 'warn', 'info', 'debug'
        logCommands: true,
        logMessages: false
    },
    
    // ════════════════════════════════════════════════
    // API KEYS (from .env)
    // ════════════════════════════════════════════════
    apiKeys: {
        openai: process.env.OPENAI_API_KEY || '',
        weatherApi: process.env.WEATHER_API_KEY || '',
        newsApi: process.env.NEWS_API_KEY || ''
    },
    
    // ════════════════════════════════════════════════
    // CRYSNOVA BRANDING
    // ════════════════════════════════════════════════
    branding: {
        footer: '© ZEE BOT | Powered by CRYSNOVA AI',
        channel: 'https://whatsapp.com/channel/0029Vb6pe77K0IBn48HLKb38',
        group: 'https://chat.whatsapp.com/Besbj8VIle1GwxKKZv1lax',
        repo: 'https://github.com/crysnovax/ZEE_BOT'
    }
};
