/**
 * ╔══════════════════════════════════════════════════╗
 * ║           Core/Database.js - ZEE BOT             ║
 * ║            Database Management System            ║
 * ╚══════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');
const config = require('../config');

const dbPath = config.databasePath;

// Database files
const databases = {
    groups: path.join(dbPath, 'groups.json'),
    users: path.join(dbPath, 'users.json'),
    commands: path.join(dbPath, 'commands.json'),
    aiMemory: path.join(dbPath, 'ai-memory.json')
};

/**
 * Initialize database
 */
async function initialize() {
    // Create database directory
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }
    
    // Create database files if they don't exist
    for (const [name, filePath] of Object.entries(databases)) {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '{}');
        }
    }
}

/**
 * Read database file
 */
function read(dbName) {
    try {
        const data = fs.readFileSync(databases[dbName], 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

/**
 * Write to database file
 */
function write(dbName, data) {
    fs.writeFileSync(databases[dbName], JSON.stringify(data, null, 2));
}

/**
 * Get group settings
 */
async function getGroupSettings(groupId) {
    const groups = read('groups');
    return groups[groupId] || {
        antiLink: config.antiSystems.antiLink.enabled,
        antiTag: config.antiSystems.antiTag.enabled,
        antiSpam: config.antiSystems.antiSpam.enabled,
        welcome: config.groupFeatures.welcome.enabled,
        goodbye: config.groupFeatures.goodbye.enabled
    };
}

/**
 * Save group settings
 */
async function saveGroupSettings(groupId, settings) {
    const groups = read('groups');
    groups[groupId] = settings;
    write('groups', groups);
}

/**
 * Get AI memory for chat
 */
async function getAIMemory(chatId) {
    const memory = read('aiMemory');
    return memory[chatId] || [];
}

/**
 * Save AI memory for chat
 */
async function saveAIMemory(chatId, messages) {
    const memory = read('aiMemory');
    memory[chatId] = messages;
    write('aiMemory', memory);
}

/**
 * Increment command usage
 */
async function incrementCommandUsage(commandName) {
    const commands = read('commands');
    commands[commandName] = (commands[commandName] || 0) + 1;
    write('commands', commands);
}

/**
 * Get command usage stats
 */
async function getCommandStats() {
    return read('commands');
}

module.exports = {
    initialize,
    getGroupSettings,
    saveGroupSettings,
    getAIMemory,
    saveAIMemory,
    incrementCommandUsage,
    getCommandStats
};
