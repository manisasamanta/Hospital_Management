
const express = require('express');
const merchantApiController = require('../../module/webservice/merchantApiController');
const { CheckAuthMerchant } = require('../../middleware/authVerification');
const uploads = require('../../../app/helper/utils');
const router = express.Router();


router.post('/loginmerchant',merchantApiController.merchantLogin)

//service
router.post('/api/createService',CheckAuthMerchant,uploads.single('image'),merchantApiController.createService)
router.post('/api/updateservice/:id',CheckAuthMerchant,uploads.single('image'),merchantApiController.updateService)
router.get('/api/deleteservice/:id',CheckAuthMerchant,merchantApiController.deleteService)

//booking
router.get('/api/bookingpage',CheckAuthMerchant,merchantApiController.bookings)


module.exports = router; 
  