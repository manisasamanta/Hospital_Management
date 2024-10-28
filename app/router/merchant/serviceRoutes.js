const express = require("express");
const serviceController = require("../../module/merchant/service/controller/serviceController");
const uploads = require('../../../app/helper/utils');
const merchantAuthController = require("../../module/merchant/merchantAuth/controller/merchantAuthController");
const { CheckAuthMerchant, Authmerchant } = require("../../middleware/authVerification");

const router = express.Router();



router.get('/servicepage',CheckAuthMerchant,Authmerchant,serviceController.service)  

router.post('/createService',CheckAuthMerchant,Authmerchant,uploads.single('image'),serviceController.createService)
router.post('/updateservice/:id',CheckAuthMerchant,Authmerchant,uploads.single('image'),serviceController.updateService)
router.get('/deleteservice/:id',serviceController.deleteService)

router.get('/addformService',CheckAuthMerchant,Authmerchant,serviceController.addServiceForm)
router.get('/editservice/:id',serviceController.editService)





module.exports = router