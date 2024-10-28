
const express = require('express');
const userApiController = require('../../module/webservice/userApiController');
const { CheckAuthUser } = require('../../middleware/authVerification');
const router = express.Router();


router.post('/signup',userApiController.signup)
router.post('/verify/otp',userApiController.verifyOTP)  
router.post('/login',userApiController.Login)

router.post('/api/createBooking',CheckAuthUser,userApiController.createBooking)


module.exports = router; 
 