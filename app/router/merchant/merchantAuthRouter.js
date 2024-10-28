
const express = require('express');
const merchantAuthController = require('../../module/merchant/merchantAuth/controller/merchantAuthController');

const router = express.Router();

//login view
router.get('/',merchantAuthController.loginview)


router.post('/login',merchantAuthController.merchantLogin)
router.get('/logout',merchantAuthController.merchantlogout)

module.exports = router; 
 