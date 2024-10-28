const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const connectDB = require('./app/config/dbcon')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config()
connectDB()
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(cookieParser());
app.use(express.json()); 

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.use(express.static(path.join(__dirname,'public/admin')))
app.use(express.static(path.join(__dirname,'public/www')))
app.use(express.static(path.join(__dirname,'public/www')))
app.use("/uploads",express.static(path.join(__dirname,'uploads')))



//user
const userViewRouter = require('./app/router/user/userViewRouter');
app.use('/',userViewRouter)

const userAuthController = require('./app/router/user/userAuthRouter')
app.use(userAuthController)

const userAppoinment_bookingRouter = require('./app/router/user/userAppoinment_bookingRouter')
app.use(userAppoinment_bookingRouter)

 //merchant -----------------------------------------------
 const serviceRouter = require('./app/router/merchant/serviceRoutes')
 app.use('/merchant',serviceRouter)

 const merchantAuthController = require('./app/router/merchant/merchantAuthRouter')
 app.use('/merchant',merchantAuthController)

 const merchant_bookingRouter = require('./app/router/merchant/bookingRoutes')
 app.use('/merchant',merchant_bookingRouter)


 //admin
 const bannerRouter = require('./app/router/admin/bannerRoutes')
 app.use('/admin',bannerRouter)

 const adminAuthRouter = require('./app/router/admin/adminAuthRouter')
 app.use('/admin',adminAuthRouter)

 const adminserviceRouter = require('./app/router/admin/serviceRoutes')
 app.use('/admin',adminserviceRouter)

 const bookingRouter = require('./app/router/admin/bookingRoutes')
 app.use('/admin',bookingRouter)


 //****************** api Routers ********************************

 const adminApiRouter = require('./app/router/api/adminApiRouter')
 app.use('/admin',adminApiRouter)

 const merchantApiRouter = require('./app/router/api/merchantApiRouter')
 app.use('/merchant',merchantApiRouter)

 const userApiRouter = require('./app/router/api/userApiRouter')
 app.use('/user',userApiRouter)








const port = 2600
app.listen(port,()=>{
    console.log(`surver running at http://localhost:${port}`);
})
  
