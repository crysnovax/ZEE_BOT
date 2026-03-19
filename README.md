# 🤖 ZEE BOT - Professional WhatsApp Bot

**Powered by CRYSNOVA AI Technology** 🔥

A rock-solid, professional WhatsApp bot with clean architecture, robust permission system, and AI-powered features.

---

## ✨ Features

### 🎯 **Core Features**
- ✅ **Solid Core Architecture** - Organized, maintainable codebase
- ✅ **Plugin System** - Easy to add new commands
- ✅ **Permission System** - Owner, Admin, Premium, User levels
- ✅ **AI Auto-Reply** - CRYSNOVA AI-powered conversations
- ✅ **Database Management** - JSON-based storage system

### 🛡️ **Anti-Spam Systems**
- ✅ **Anti-Link** - Automatically remove/warn for links
- ✅ **Anti-Tag** - Prevent mass tagging (max mentions per message)
- ✅ **Anti-Spam** - Flood protection (rate limiting)

### 👥 **Group Features**
- ✅ **Welcome Messages** - Greet new members
- ✅ **Goodbye Messages** - Farewell leaving members
- ✅ **Group Settings** - Per-group configuration

### ⚙️ **Configuration**
- ✅ **.env Support** - Environment variables
- ✅ **config.js** - Centralized configuration
- ✅ **Public/Private Mode** - Control who can use the bot
- ✅ **Auto-Read Messages** - Automatically mark as read

---

## 📦 Installation

### **Prerequisites**
- Node.js v20 or higher
- Git

### **Step 1: Clone Repository**
```bash
git clone https://github.com/your-username/ZEE_BOT.git
cd ZEE_BOT
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Configure Environment**
```bash
cp .env.example .env
nano .env
```

**Edit .env with your settings:**
```env
BOT_NAME=ZEE BOT
OWNER_NUMBER=234XXXXXXXXXX
PREFIX=.
PUBLIC_MODE=false
AUTO_REPLY=true
```

### **Step 4: Start Bot**
```bash
npm start
```

**Scan the QR code with WhatsApp!** 📱

---

## 📁 **Project Structure**

```
ZEE_BOT/
├── Core/                    # Core bot functionality
│   ├── Connection.js        # WhatsApp connection handler
│   ├── MessageHandler.js    # Main message processor
│   ├── PermissionChecker.js # Permission system
│   ├── AntiSystem.js        # Anti-spam protection
│   ├── AutoReply.js         # AI auto-reply system
│   ├── PluginLoader.js      # Plugin management
│   ├── Database.js          # Database management
│   └── GroupHandler.js      # Group events
├── Plugins/                 # Command plugins
│   ├── menu.js              # Menu command
│   ├── ping.js              # Ping command
│   └── owner.js             # Owner commands
├── lib/                     # Libraries
│   └── serialize.js         # Message serialization
├── database/                # Database files (auto-created)
├── zee-session/             # Session data (auto-created)
├── main.js                  # Entry point
├── config.js                # Configuration
├── package.json             # Dependencies
├── .env.example             # Environment template
└── README.md                # Documentation
```

---

## 🔧 **Configuration**

### **config.js**

All bot settings in one place:

```javascript
module.exports = {
    botName: 'ZEE BOT',
    botOwner: '2347043550282',
    prefix: '.',
    
    mode: {
        public: false,          // Public/private mode
        selfBot: false,         // Self-bot mode
        autoRead: true,         // Auto-read messages
        alwaysOnline: true      // Always online
    },
    
    antiSystems: {
        antiLink: {
            enabled: true,
            action: 'delete'    // 'delete', 'warn', 'kick'
        },
        antiTag: {
            enabled: true,
            maxTags: 5,         // Max mentions per message
            action: 'warn'
        },
        antiSpam: {
            enabled: true,
            maxMessages: 10,    // Max messages
            timeWindow: 10000,  // Within 10 seconds
            action: 'warn'
        }
    }
};
```

---

## 🎮 **Commands**

### **General Commands**
- `.menu` - Show all commands
- `.ping` - Check bot response time

### **Owner Commands**
- `.stats` - Show bot statistics
- `.status` - Bot status

---

## 🔌 **Creating Plugins**

Create a new file in `Plugins/` folder:

```javascript
// Plugins/example.js

module.exports = {
    command: ['example', 'ex'],        // Command name & aliases
    description: 'Example command',     // Description
    category: 'general',                // Category
    permission: 'user',                 // 'owner', 'admin', 'premium', 'user'
    groupOnly: false,                   // Only in groups
    privateOnly: false,                 // Only in DMs
    
    async execute(sock, msg, args) {
        await msg.reply('This is an example command!');
    }
};
```

**The bot will automatically load it on startup!** 🔥

---

## 🛡️ **Permission System**

### **Levels:**
1. **Owner** - Full access (set in .env)
2. **Admin** - Group admins
3. **Premium** - Premium users
4. **User** - Everyone else

### **Usage in Commands:**
```javascript
module.exports = {
    command: 'restricted',
    permission: 'owner',  // Only owners can use
    
    async execute(sock, msg, args) {
        // Command code
    }
};
```

---

## 🤖 **AI Auto-Reply**

ZEE BOT uses **CRYSNOVA AI** for intelligent conversations!

**Features:**
- ✅ Context-aware responses
- ✅ Conversation memory (10 messages)
- ✅ Natural language understanding

**Configure in config.js:**
```javascript
autoReply: {
    enabled: true,
    ai: {
        enabled: true,
        apiUrl: 'https://all-in-1-ais.officialhectormanuel.workers.dev/',
        model: 'gpt-4.5-preview',
        maxMemory: 10
    }
}
```

---

## 📊 **Database**

Uses JSON-based database for simplicity:

**Files:**
- `database/groups.json` - Group settings
- `database/users.json` - User data
- `database/commands.json` - Command usage stats
- `database/ai-memory.json` - AI conversation memory

---

## 🚀 **Deployment**

### **Render.com**
1. Push to GitHub
2. Connect to Render
3. Add environment variables from `.env`
4. Deploy!

### **Railway.app**
1. Push to GitHub
2. Connect to Railway
3. Add environment variables
4. Deploy!

### **VPS/Local**
```bash
npm start
# Or use PM2:
pm2 start main.js --name zee-bot
```

---

## 🔥 **Why ZEE BOT?**

| Feature | ZEE BOT | Other Bots |
|---------|---------|------------|
| **Architecture** | Clean, modular | Messy |
| **Permission System** | Solid, tested | Buggy |
| **Anti-Spam** | All working | Often broken |
| **Auto-Reply** | AI-powered | Basic |
| **Plugin System** | Easy to use | Complex |
| **Documentation** | Comprehensive | Minimal |

---

## 📝 **License**

MIT License - Feel free to use and modify!

---

## 👨‍💻 **Credits**

**Created by:** CRYSNOVA  
**Powered by:** CRYSNOVA AI Technology  
**Inspired by:** Professional WhatsApp bot architecture

---

## 🌐 **Links**

- **Channel:** https://whatsapp.com/channel/0029Vb6pe77K0IBn48HLKb38
- **Group:** https://chat.whatsapp.com/Besbj8VIle1GwxKKZv1lax
- **GitHub:** https://github.com/crysnovax/ZEE_BOT

---

## 🤝 **Support**

Having issues? Join our support group!

---

**Made with ❤️ by CRYSNOVA** 🔥
