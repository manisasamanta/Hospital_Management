
const express = require('express');
const adminAuthController = require('../../module/admin/adminAuth/controller/adminAuthController');


const router = express.Router();

//login view
router.get('/',adminAuthController.loginview)


router.post('/login',adminAuthController.adminLogin)
router.get('/logout',adminAuthController.adminlogout)

module.exports = router; 
 