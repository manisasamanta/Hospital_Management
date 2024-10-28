const express = require('express')
const userViewController = require('../../module/user/controller/userViewController')
const { AuthUser, CheckAuthUser } = require('../../middleware/authVerification')

const Router = express.Router()
 

Router.get('/signup',userViewController.signup) 
Router.get('/login',userViewController.login)
Router.get('/otp/verify',userViewController.otpverifi)
 

Router.get('/',CheckAuthUser,userViewController.home)
Router.get('/doctors',CheckAuthUser,userViewController.doctors)
Router.get('/service',CheckAuthUser,userViewController.service)
Router.get('/appoinment',CheckAuthUser,userViewController.appoinment)
Router.get('/services/:id',CheckAuthUser,userViewController.service_details)
Router.get('/confirmation',CheckAuthUser,userViewController.confirmation)


Router.get('/search',CheckAuthUser,userViewController.search)
Router.get('/profile',CheckAuthUser,userViewController.profile)



  
 

module.exports = Router