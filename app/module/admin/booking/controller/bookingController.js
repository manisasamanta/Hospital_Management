// controllers/adminController.js
const Booking = require('../../../user/model/appoinment_booking');
const User = require('../../../user/model/userModel');

class AdminBookingController {

    //booking------------------------------
booking=async(req,res)=>{  
    try{
        const bookings=await Booking.find()
        .populate('service','heading')
        .populate('assignedTo','username') // Populate service to get service details
        
        const merchants = await User.find({ role: 'merchant' });
  
       
            res.render('admin/layouts/booking/bookingList',{
         title:'booking',
         bookings,
         merchants, 
         admin:req.admin
            })
        
     
    }catch(err){
        console.log(err);
    }
  } 


   

// Update booking status
updateBooking = async (req, res) => {
    
    try {
        const { status} = req.body;
        const { id } = req.params;


    if (status !== 'pending' && status !== 'completed') {
        return res.status(400).send('Invalid status');
    }
       // Update the order status
       await Booking.findByIdAndUpdate(
        id,
        { status: status }, // Update status to 'Confirmed' or 'Cancelled'
        { new: true } // Return the updated document
    );
        res.redirect('/admin/bookingpage');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}



// Delete a booking
deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).send('Booking not found');
        }

        // Delete the booking
        await Booking.findByIdAndDelete(bookingId);
        res.redirect('/admin/bookingpage');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}


// Route to handle the assignment of bookings to employees
assign_booking = async (req, res) => {

    const { bookingId, assignedTo } = req.body;

    try {
        // Ensure both bookingId and assignedTo are provided
        if (!bookingId || !assignedTo) {
            return res.status(400).send('Booking ID and merchant must be specified');
        }

        // Find the booking and update its assigned employee
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).send('Booking not found');
        }
 
        // Verify that the employee exists
        const merchant = await User.findById(assignedTo);

        if (!merchant || merchant.role !== 'merchant') {
            return res.status(400).send('Invalid merchant selected');
        }

        // Update the booking with the new employee assignment
        booking.assignedTo = merchant._id;
        await booking.save();

        res.redirect('/admin/bookingpage'); // Redirect back to the admin panel
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}


}

module.exports = new AdminBookingController();
