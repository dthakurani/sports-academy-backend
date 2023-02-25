const { Router } = require('express');

const userController = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');

const router = Router();

router.post('/', userValidator.addUserSchema, userController.addUser);

module.exports = router;
