
const Service = require("../../merchant/service/model/serviceModel");
const User = require('../../user/model/userModel')
const booking = require('../../user/model/appoinment_booking')

 


 class userViewController{
  //signup
  signup = async (req, res) => {
    try{    
       res.render("www/layouts/userSignup", {
        title: "signup", 
        data:req.user
      });

    }catch(error){
      console.log(error);
    }
  };

  //login
  login = async (req, res) => {
    try{    
       res.render("www/layouts/userLogin", {
        title: "login",
        data:req.user
      });

    }catch(error){
      console.log(error);
    }
  };


  otpverifi=async(req,res)=>{
        
    res.render('www/layouts/otpVerification',{
        title:'otp verify',
        data:req.user
    })
}



//home
home = async (req, res) => {
    try{    
       res.render("www/layouts/home", {
        title: "home",
        data:req.user
      });

    }catch(error){
      console.log(error);
    }
  };

 
  //appoinment
appoinment = async (req, res) => {
    try{    
      if (!req.user) {
        return res.redirect('/login'); // Redirect to login if user is not authenticated
    }
      const services = await Service.find();
       res.render("www/layouts/appoinment", {
        title: "appoinment",
        services,
        data:req.user
      });

    }catch(error){
      console.log(error);
    }
  };


  //doctors
  doctors = async (req, res) => {
    try{    
       res.render("www/layouts/doctors", {
        title: "doctors",
        data:req.user
      });

    }catch(error){
      console.log(error);
    }
  };


  //service  
  service = async (req, res) => {
    try{    
     
        const sdata = await Service.find({ status: 'accepted' })
        const categories = [...new Set(sdata.map(service => service.heading))];

       res.render("www/layouts/service", {
        title: "service",
        sdata,
        categories,
        data:req.user
      });
      
    }catch(error){
      console.log(error);
    }
  };

  // //service_opthomology
  service_details = async (req, res) => {
    try{   
      const serviceId = req.params.id;
      // console.log("Service ID:", serviceId); 
      
      const serviceDetail = await Service.findById(serviceId).populate('merchantId', 'username')
       
      if (!serviceDetail) {
        return res.status(404).send('Service not found');
    }

       res.render("www/layouts/service_opthomology", {
        title: "service_details",
        serviceDetail,
        data:req.user
      });

    }catch(error){
      console.error("Error fetching service details:", error);
    }
  };


  //confirmation
  confirmation = async (req, res) => {
    try{    
       res.render("www/layouts/confirmation", {
        title: "confirmation",
        data:req.user
      });

    }catch(error){
      console.log(error);
    }
  };


  search =async (req, res) => {
    try {
      const query = req.query.query.toLowerCase();
      
      // Fetch all services from the database (or use your predefined data)
      const sdata = await Service.find();
      // const categories = await .find()
  
      // Filter services based on the search query
      const filteredServices = sdata.filter(service =>
        service.heading.toLowerCase().includes(query) || service.description.toLowerCase().includes(query)
      );
  
      // Render the services page with the filtered results
      res.render('www/layouts/search_results', { 
        services: filteredServices ,
        data:req.user
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

profile = async (req, res) => {
  // console.log("Profile route accessed");
  // console.log("Authenticated User ID:", req.user ? req.user.id : "No user"); // Use req.user.id
  try {
    if (!req.user) {
      return res.status(401).send('User not authenticated');
    }
 const user2 = await User.findById(req.user.id); 
      // Fetch user details
      const bookings = await booking.find({ user:req.user.id }).populate('service'); // Function to get user's bookings
      console.log('Fetching bookings for user ID:', req.user.id);
      console.log('Fetched Bookings:', bookings);
      res.render('www/layouts/profile', { 
        data: req.user, 
        bookings,
        user2
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
}



 }

 module.exports = new userViewController()




  