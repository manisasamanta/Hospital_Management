const express = require("express");
const bookingController = require("../../module/admin/booking/controller/bookingController");
const { CheckAuthAdmin, Authadmin } = require("../../middleware/authVerification");
const router = express.Router();

 


router.get('/bookingpage',CheckAuthAdmin,Authadmin,bookingController.booking)

router.post('/booking/status/:id',bookingController.updateBooking);
router.get('/booking/delete/:id', bookingController.deleteBooking);

router.post('/assign_booking',bookingController.assign_booking); 


module.exports = router