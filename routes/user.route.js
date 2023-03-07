const { Router } = require('express');

const userController = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');
const { responseHandler } = require('../helper/generic-response');
const { checkAccessToken, checkRefreshToken } = require('../middlewares/authenticate');

const router = Router();

router.post('/forget-password', userValidator.forgetPasswordSchema, userController.forgetPassword);
router.post('/reset-password/:token', userValidator.resetPasswordSchema, userController.resetPassword, responseHandler);
router.post('/', userValidator.addUserSchema, userController.addUser, responseHandler, responseHandler);
router.patch('/', checkAccessToken, userValidator.updateUserSchema, userController.updateUser, responseHandler);
router.post('/login', userValidator.loginUserSchema, userController.loginUser, responseHandler);
router.post('/generate-access-token', checkRefreshToken, userController.generateAccessToken, responseHandler);
router.post('/logout', checkRefreshToken, userController.logoutUser, responseHandler);

module.exports = router;
