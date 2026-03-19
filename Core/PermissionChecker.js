/**
 * ╔══════════════════════════════════════════════════╗
 * ║      Core/PermissionChecker.js - ZEE BOT         ║
 * ║            Permission Management System          ║
 * ╚══════════════════════════════════════════════════╝
 */

const config = require('../config');

/**
 * Check if user has required permission
 * @param {string} userId - User JID
 * @param {string} level - Permission level: 'owner', 'admin', 'premium', 'user'
 * @param {string} groupId - Group JID (for admin checks)
 * @param {object} sock - WhatsApp socket
 * @returns {Promise<boolean>}
 */
async function checkPermission(userId, level = 'user', groupId = null, sock = null) {
    try {
        // Normalize user ID
        const normalizedUserId = userId.includes('@') ? userId : `${userId}@s.whatsapp.net`;
        
        // Owner check
        if (level === 'owner') {
            return config.permissions.owners.includes(normalizedUserId);
        }
        
        // Premium check
        if (level === 'premium') {
            const isOwner = config.permissions.owners.includes(normalizedUserId);
            const isPremium = config.permissions.premium.includes(normalizedUserId);
            return isOwner || isPremium;
        }
        
        // Admin check (requires group context)
        if (level === 'admin') {
            // Owners are always admins
            if (config.permissions.owners.includes(normalizedUserId)) {
                return true;
            }
            
            // Check if user is group admin
            if (groupId && sock) {
                try {
                    const groupMetadata = await sock.groupMetadata(groupId);
                    const participant = groupMetadata.participants.find(p => p.id === normalizedUserId);
                    return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
                } catch (error) {
                    console.log('[PERMISSION ERROR] Could not fetch group metadata:', error.message);
                    return false;
                }
            }
            
            return false;
        }
        
        // User level (everyone except banned)
        if (level === 'user') {
            return !config.permissions.banned.includes(normalizedUserId);
        }
        
        return false;
        
    } catch (error) {
        console.log('[PERMISSION ERROR]', error);
        return false;
    }
}

/**
 * Check if user is owner
 */
async function isOwner(userId) {
    return checkPermission(userId, 'owner');
}

/**
 * Check if user is admin in group
 */
async function isAdmin(userId, groupId, sock) {
    return checkPermission(userId, 'admin', groupId, sock);
}

/**
 * Check if user is premium
 */
async function isPremium(userId) {
    return checkPermission(userId, 'premium');
}

/**
 * Check if user is banned
 */
function isBanned(userId) {
    const normalizedUserId = userId.includes('@') ? userId : `${userId}@s.whatsapp.net`;
    return config.permissions.banned.includes(normalizedUserId);
}

/**
 * Check if bot is admin in group
 */
async function isBotAdmin(groupId, sock) {
    try {
        const groupMetadata = await sock.groupMetadata(groupId);
        const botId = sock.user.id.replace(/:\d+/, '');
        const botParticipant = groupMetadata.participants.find(p => p.id.includes(botId));
        return botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin');
    } catch (error) {
        console.log('[BOT ADMIN CHECK ERROR]', error.message);
        return false;
    }
}

module.exports = {
    checkPermission,
    isOwner,
    isAdmin,
    isPremium,
    isBanned,
    isBotAdmin
};
