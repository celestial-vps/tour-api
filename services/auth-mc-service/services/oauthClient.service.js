const OAuthClient = require('../models/OAuthClient');
const crypto = require('crypto');

/**
 * Membuat OAuth Client baru
 * @param {Object} payload
 * @param {String} payload.name - Nama aplikasi client
 * @param {Array} payload.redirectUris - Array redirect URIs
 * @param {Array} payload.grants - Array grant types yang diizinkan
 * @param {String} [payload.userId] - Opsional, user yang terkait client
 * @returns {Object} { client, err }
 */
const createClient = async ({ name, redirectUris, grants, userId = null }) => {
    try {
        // Generate clientId dan clientSecret random
        const clientId = crypto.randomBytes(16).toString('hex');
        const clientSecret = crypto.randomBytes(32).toString('hex');

        const client = new OAuthClient({
            name,
            clientId,
            clientSecret,
            redirectUris,
            grants,
            user: userId
        });

        await client.save();

        // Jangan kembalikan clientSecret dalam response publik jika ingin lebih aman
        return { client, err: null };
    } catch (err) {
        console.error('Create OAuth Client Error:', err);
        return { client: null, err };
    }
};

/**
 * Ambil client berdasarkan clientId
 * @param {String} clientId
 * @returns {Object} { client, err }
 */
const getClientById = async (clientId) => {
    try {
        const client = await OAuthClient.findOne({ clientId });
        if (!client) return { client: null, err: new Error('Client not found') };
        return { client, err: null };
    } catch (err) {
        console.error('Get Client Error:', err);
        return { client: null, err };
    }
};

module.exports = {
    createClient,
    getClientById
};
