const { Router } = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const courtController = require('../controllers/court.controller');
const courtValidator = require('../validators/court.validator');
const { responseHandler } = require('../helper/generic-response');
const { checkAccessToken } = require('../middlewares/authenticate');
const { checkAdmin } = require('../middlewares/authorize');

const router = Router();

router.post('/', checkAccessToken, checkAdmin, upload.single('file'), courtController.addCourt, responseHandler);
router.put('/:id', checkAccessToken, checkAdmin, upload.single('file'), courtController.updateCourt, responseHandler);
router.get('/', checkAccessToken, courtController.getAllCourts, responseHandler);
router.delete('/:id', checkAccessToken, checkAdmin, courtValidator.deleteCourt, courtController.deleteCourt, responseHandler);

module.exports = router;
