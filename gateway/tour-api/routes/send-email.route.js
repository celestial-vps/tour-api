const express = require('express');
const { SendEmailController } = require('../controllers/send-email.controller');

function sendEmailRouter() {
    const router = express.Router();
    const sendEmailController = new SendEmailController();

    router.get('/', (req, res) => sendEmailController.sendEmail(req, res));

    return router;
}

module.exports = { sendEmailRouter };
