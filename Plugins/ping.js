/**
 * Ping Command - Check bot response time
 */

module.exports = {
    command: ['ping', 'speed'],
    description: 'Check bot response time',
    category: 'general',
    
    async execute(sock, msg, args) {
        const start = Date.now();
        const sent = await msg.reply('🏓 Pinging...');
        const latency = Date.now() - start;
        
        await sock.sendMessage(msg.from, {
            text: `🏓 Pong!\n⚡ Response: ${latency}ms`,
            edit: sent.key
        });
    }
};
