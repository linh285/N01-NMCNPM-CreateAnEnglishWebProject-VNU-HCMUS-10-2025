var express = require('express');
var router = express.Router();

const { isAuth } = require('../app/middlewares/authMiddleware');
const restrictTo = require('../app/middlewares/restrictTo');

const adminController = require('../app/controllers/adminController');

router.use(isAuth);
router.use(restrictTo('ADMIN')); 

router.get('/dashboard', adminController.getDashboardStats);
router.get('/accounts', adminController.getAllAccounts);

router.patch('/accounts/:idACCOUNT/status', adminController.updateAccountStatus);

module.exports = router;