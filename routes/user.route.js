const { Router } = require('express');

const userController = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');
const { responseHandler } = require('../helper/generic-response');

const router = Router();

router.post('/', userValidator.addUserSchema, userController.addUser, responseHandler);

router.post('/login', userValidator.loginUserSchema, userController.loginUser, responseHandler);

module.exports = router;
