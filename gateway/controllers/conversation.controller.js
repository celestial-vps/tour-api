const conversationService = require('../gateway/services/conversation.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
	try {
		const userJwt = req.authorization_payload;
		const { conversation, err } = await conversationService.create(req.body, userJwt.userOid);

		if (err) {
			return buildResponse.sendQueryError(res, err.message, "insert");
		}

		return buildResponse.createOk(res, conversation, 1);
	} catch (err) {
		console.error('Controller Create Error:', err);
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const update = async (req, res) => {
	try {
		const userJwt = req.authorization_payload;
		const { conversation, err } = await conversationService.update(req.params.oid, req.body, userJwt.userOid);

		if (err) {
			return buildResponse.sendQueryError(res, err.message, "update");
		}
		return buildResponse.updateOk(res, conversation, 1);
	} catch (err) {
		console.error('Controller Update Error:', err); 
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const remove  = async (req, res) => {
	try {
		const { conversation, err } = await conversationService.deleted(req.params.oid);

		if (err) {
			return buildResponse.sendQueryError(res, err.message || err, "delete");
		}

		return buildResponse.sendDeleteOk(res, conversation);
	} catch (err) {
		console.error('Controller Delete Error:', err); 
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const findAll = async (req, res) => {
	try {
		const { conversations, err } = await conversationService.findAll();

		if (err) {
			return buildResponse.sendQueryError(res, err.message, "get all");
		}

		return buildResponse.findOk(res, conversations, conversations.length);
	} catch (err) {
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['conversationName']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await conversationService.findPage(filters, options);

    if (result.err) {
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    return buildResponse.sendPagination(res, result.conversations, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    console.error('Controller error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
	try {
		const options = {
			include: [], 
		};

		const { conversation, err } = await conversationService.findById(req.params.oid, options);

		if (err) {
			return buildResponse.sendQueryError(res, err.message, "get by id");
		}

		if (!conversation) return buildResponse.sendDataNotFound(res);

		return buildResponse.findOk(res, conversation);
	} catch (err) {
		return buildResponse.sendInternalServerError(res, err.message);
	}
};

module.exports = {
	create,
	update,
	remove,
	findAll,
	find,
	findById,
};
