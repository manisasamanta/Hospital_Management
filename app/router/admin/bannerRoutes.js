const express = require('express');
const uploads = require('../../../app/helper/utils');
const bannerController = require('../../module/admin/banner/controller/bannerController');
const { CheckAuthAdmin, Authadmin} = require('../../middleware/authVerification');
const router = express.Router();


//banner
router.post('/createBanner',uploads.single('image'),bannerController.createBanner)
router.post('/updatebanner/:id',uploads.single('image'),bannerController.updateBanner)
router.get('/deletebanner/:id',bannerController.deleteBanner)

router.get('/addform',CheckAuthAdmin,Authadmin,bannerController.addBannerForm)
router.get('/edit/:id',bannerController.editBanner)
router.get('/statuscheck/:id',bannerController.statusCheck) 

//bannerview
router.get('/bannerpage',CheckAuthAdmin,Authadmin,bannerController.bannerview) 






module.exports = router;