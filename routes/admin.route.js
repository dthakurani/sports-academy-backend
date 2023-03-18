const { Router } = require('express');

const adminController = require('../controllers/admin.controller');
const adminValidator = require('../validators/admin.validator');
const { responseHandler } = require('../helper/generic-response');
const { checkAccessToken } = require('../middlewares/authenticate');
const { checkAdmin } = require('../middlewares/authorize');

const router = Router();

router.post('/court', checkAccessToken, checkAdmin, adminValidator.addCourt, adminController.addCourt, responseHandler);
router.patch('/court/:id', checkAccessToken, checkAdmin, adminValidator.updateCourt, adminController.updateCourt, responseHandler);

module.exports = router;
