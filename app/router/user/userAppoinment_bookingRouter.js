const express = require('express');
const userAppoinment_bookingController = require('../../module/user/controller/userAppoinment_bookingController');
const { CheckAuthUser } = require('../../middleware/authVerification');
const router = express.Router();


router.post('/createBooking',CheckAuthUser,userAppoinment_bookingController.createBooking)
router.post('/cancel-booking',CheckAuthUser,userAppoinment_bookingController.cancelbooking)


module.exports = router;     