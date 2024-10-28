const Booking = require("../../../module/user/model/appoinment_booking");
const User = require("../../../module/user/model/userModel");


 
class bookingController{


    bookings = async (req, res) => {
        try{    
          const merchant = await User.findById(req.merchant.id); // req.admin.id should be the ID of the logged-in admin
          const bookings = await Booking.find({ 
            assignedTo: merchant._id 
          }).populate('service'); // Populate service to get service details

           res.render("merchant/layouts/booking/bookingList", {
            title: "booking",
            edata:req.merchant,
            bookings,
            merchant:req.merchant
          });
    
        }catch(error){
          console.log(error);
        }
      };


}

module.exports = new bookingController()