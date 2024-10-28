
const express = require('express');
const serviceController = require('../../module/admin/service/controller/serviceController');
const { CheckAuthAdmin, Authadmin} = require('../../middleware/authVerification');
const router = express.Router();



router.get('/servicepage',CheckAuthAdmin,Authadmin,serviceController.pending_servicepage)
router.get('/accepted_servicepage',CheckAuthAdmin,Authadmin,serviceController.accepted_servicepage)

router.post('/approve-service/:id',serviceController.approveService);
router.post('/reject-service/:id', serviceController.rejectService);

//merchant
router.get('/merchantpage',CheckAuthAdmin,Authadmin,serviceController.merchant)



module.exports = router; 
