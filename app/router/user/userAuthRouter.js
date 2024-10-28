const express = require('express');
const userAuthController = require('../../module/user/controller/userAuthController');

const router = express.Router();

router.post('/signup',userAuthController.signup)

router.post('/login',userAuthController.Login)

router.get('/logout',userAuthController.logout)

router.post('/otp/verify',userAuthController.verifyOTP)

// router.get('/confirmation/:email/:token',customerController.confirmation)

module.exports = router; 