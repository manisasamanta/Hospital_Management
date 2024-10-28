
const express = require('express');
const adminApiController = require('../../module/webservice/adminApiController');
const { CheckAuthAdmin} = require('../../middleware/authVerification');
const router = express.Router();


router.post('/login_admin',adminApiController.adminLogin)

//service
router.get('/api/accepted_servicepage',CheckAuthAdmin,adminApiController.accepted_servicepage)
router.post('/api/approve-service/:id',CheckAuthAdmin,adminApiController.approveService);
router.post('/api/reject-service/:id',CheckAuthAdmin,adminApiController.rejectService);


//booking
router.get('/api/bookingpage',CheckAuthAdmin,adminApiController.booking)

router.post('/api/booking/status/:id',CheckAuthAdmin,adminApiController.updateBooking);
router.get('/api/booking/delete/:id',CheckAuthAdmin,adminApiController.deleteBooking);

router.post('/api/assign_booking',CheckAuthAdmin,adminApiController.assign_booking); 

 

module.exports = router; 
 