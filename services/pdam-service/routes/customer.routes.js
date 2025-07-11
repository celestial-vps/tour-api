const express = require('express');
const CustomerController = require('../controllers/customer.controller');

const router = express.Router();

router.get('/', CustomerController.getAll);
router.get('/:id', CustomerController.getById);
router.post('/', CustomerController.create);
router.put('/:id', CustomerController.update);
router.delete('/:id', CustomerController.delete);

module.exports = router;
