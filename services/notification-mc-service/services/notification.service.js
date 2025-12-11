// services/notification.service.js
const admin = require("firebase-admin");
const buildResponse = require("../common/build.response");

// INIT FIREBASE ADMIN
const serviceAccount = require("../config/celestial-5a4e4-firebase-adminsdk-fbsvc-46e9a64d8e.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

/*
 * BODY EXPECTED:
 * {
 *   "token": "FCM_DEVICE_TOKEN",
 *   "title": "Judul Notifikasi",
 *   "body": "Isi Notifikasi",
 *   "data": { "key": "value" }
 * }
 */

const sendNotification = async (payload) => {
    try {
        const message = {
            token: payload.token,
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {}
        };

        const response = await admin.messaging().send(message);

        return {
            notification: { messageId: response },
            err: null
        };

    } catch (error) {
        console.error("FCM Error:", error);

        return {
            notification: null,
            err: buildResponse.responseInternalServerError(error).data.error
        };
    }
};

const sendNotificationToMultipleDevices = async (tokens, payload) => {
    try {
        if (!tokens || tokens.length === 0) {
            throw new Error("No device tokens provided");
        }

        const message = {
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {},
            tokens // array of device tokens
        };

        const response = await admin.messaging().sendMulticast(message);

        return {
            notification: { successCount: response.successCount, failureCount: response.failureCount, responses: response.responses },
            err: null
        };
    } catch (error) {
        console.error("FCM Multicast Error:", error);
        return {
            notification: null,
            err: error.message
        };
    }
};


module.exports = {
    sendNotification,sendNotificationToMultipleDevices
};
