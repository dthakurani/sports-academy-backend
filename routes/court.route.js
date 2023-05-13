const { Router } = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const adminController = require('../controllers/court.controller');
const adminValidator = require('../validators/court.validator');
const { responseHandler } = require('../helper/generic-response');
const { checkAccessToken } = require('../middlewares/authenticate');
const { checkAdmin } = require('../middlewares/authorize');

const router = Router();

router.post('/', checkAccessToken, checkAdmin, adminValidator.addCourt, upload.single('file'), adminController.addCourt, responseHandler);
router.patch('/:id', checkAccessToken, checkAdmin, adminValidator.updateCourt, adminController.updateCourt, responseHandler);
router.get('/', checkAccessToken, adminController.getAllCourts, responseHandler);

module.exports = router;
