const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const conversationController = require('../../controllers/conversation.controller');
const { validateRequest } = require('../misc/validation');
const {
    createConversationDto, updateConversationDto, deleteConversationDto, getConversationDto, filterConversationDto
} = require('../../dtos/payload-conversation-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Conversation
 *     description: Conversation management operations
 */

router.post('/create', validateRequest(createConversationDto), roleGuard('Admin'), conversationController.create);

router.put('/:oid', validateRequest(updateConversationDto), roleGuard('Admin'), conversationController.update);

router.delete('/delete/:oid', validateRequest(deleteConversationDto), roleGuard('Admin'), conversationController.remove);

router.get('/', validateRequest(filterConversationDto), roleGuard('Admin'), conversationController.findAll);

router.post('/q', validateRequest(filterConversationDto), roleGuard('Admin'), conversationController.find);

router.get('/:oid', validateRequest(getConversationDto), roleGuard('Admin'), conversationController.findById);

module.exports = router;
