const express = require('express');
const router = express.Router();
const oauthClientController = require('../controllers/OAuthClientController');

router.post('/clients', oauthClientController.registerClient);

module.exports = router;
