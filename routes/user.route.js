const { Router } = require('express');

const userController = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');

const router = Router();

router.post('/', userValidator.addUserSchema, userController.addUser);
router.post('/forget-password', userValidator.forgetPasswordSchema, userController.forgetPassword);
router.post('/reset-password/:token', userValidator.resetPasswordSchema, userController.resetPassword);

module.exports = router;
