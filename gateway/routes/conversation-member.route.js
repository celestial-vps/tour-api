const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const conversationMemberController = require('../../controllers/conversation-member.controller');
const { validateRequest } = require('../misc/validation');
const {
    createConversationMemberDto, deleteConversationMemberDto, getConversationMemberDto, filterConversationMemberDto
} = require('../../dtos/payload-conversation-member-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: ConversationMember
 *     description: Conversation Member management operations
 */

router.post('/create', validateRequest(createConversationMemberDto), roleGuard('Admin'), conversationMemberController.create);

router.delete('/delete/:conversationOid/:userOid', validateRequest(deleteConversationMemberDto), roleGuard('Admin'), conversationMemberController.remove);

router.get('/', validateRequest(filterConversationMemberDto), roleGuard('Admin'), conversationMemberController.findAll);

router.post('/q', validateRequest(filterConversationMemberDto), roleGuard('Admin'), conversationMemberController.find);

router.get('/:oid', validateRequest(getConversationMemberDto), roleGuard('Admin'), conversationMemberController.findById);

module.exports = router;
