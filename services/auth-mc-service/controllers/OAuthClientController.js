const oauthClientService = require('../services/oauthClient.service');
const buildResponse = require('../common/build.response');

const registerClient = async (req, res) => {
    try {
        const { name, redirectUris, grants, userId } = req.body;

        // Panggil service untuk membuat client baru
        const { client, err } = await oauthClientService.createClient({
            name,
            redirectUris,
            grants,
            userId
        });

        if (err) return buildResponse.sendQueryError(res, err.message, "registerClient");

        return buildResponse.createOk(res, client, 1);

    } catch (err) {
        console.error('Register Client Error:', err);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

module.exports = {
    registerClient
};
