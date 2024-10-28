
const express = require('express');
const bookingController = require('../../module/merchant/booking/bookingController');
const { CheckAuthMerchant, Authmerchant } = require('../../middleware/authVerification');

const router = express.Router();


router.get('/bookingpage',CheckAuthMerchant,Authmerchant,bookingController.bookings)


module.exports = router; 
 