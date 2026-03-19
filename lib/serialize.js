/**
 * Message Serialization for easier handling
 */

const config = require('../config');

async function serialize(sock, msg) {
    if (!msg.message) return msg;
    
    const m = {};
    
    m.message = msg.message;
    m.key = msg.key;
    m.from = msg.key.remoteJid;
    m.sender = msg.key.fromMe ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : (msg.key.participant || msg.key.remoteJid);
    m.isGroup = m.from.endsWith('@g.us');
    m.pushName = msg.pushName || 'Unknown';
    
    // Extract message type and text
    const messageTypes = Object.keys(msg.message);
    m.type = messageTypes[0] === 'senderKeyDistributionMessage' ? messageTypes[1] : messageTypes[0];
    
    const msgContent = msg.message[m.type];
    m.text = msgContent?.text || msgContent?.caption || msgContent?.conversation || '';
    
    // Reply function
    m.reply = async (text, options = {}) => {
        return sock.sendMessage(m.from, { text, ...options }, { quoted: msg });
    };
    
    // Delete message function
    m.delete = async () => {
        return sock.sendMessage(m.from, { delete: msg.key });
    };
    
    return m;
}

module.exports = { serialize };
