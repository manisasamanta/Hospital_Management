const User = require("../../module/user/model/userModel");
const Service = require("../../module/merchant/service/model/serviceModel");
const Booking = require('../../module/user/model/appoinment_booking');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');



class adminController{


    // admin login
    adminLogin = async (req, res) => {
        try{

            const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user.role === 'user' || user.role === 'merchant') {
            return res.status(500).json('user and merchant can not login in this page')
        }
        if (!user) return res.status(400).json('User not found');
        if (!user.isVerified) return res.status(400).json('Email not verified');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json('Invalid password');

        const jwtToken = jwt.sign({ id: user._id, role: user.role,username:user.username },'ghcghvchgvhvvmjhadmin', { expiresIn: '30d' });

        return res.status(200).json({
            status: true,
            message: "Login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            jwtToken,
        });

        }catch(error){
            res.status(500).json({
                status:false,
                message:error.message
              });
        }
    };

    //**************** services  ***********/

    pending_servicepage = async (req, res) => {
        try {    
            const services = await Service.find({ status: 'pending' }).populate('merchantId', 'username');
            
            res.json({
                title: "pending service",
                services,
                // admin: req.admin 
            });  
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
    
    accepted_servicepage = async (req, res) => {
        try {    
            const services = await Service.find({ status: 'accepted' }).populate('merchantId', 'username');
            
            res.json({
                title: "accepted service",
                services,
                // admin: req.admin
            }); 
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
    
    approveService = async (req, res) => {
        const { id } = req.params;
        try {
            const service = await Service.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
            res.json({ message: "Service approved successfully", service });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
    
    rejectService = async (req, res) => {
        const { id } = req.params;
        try {
            const service = await Service.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
            res.json({ message: "Service rejected successfully", service });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
    



//************************* bookings **************/

// Get all bookings
booking = async (req, res) => {  
    try {
        const bookings = await Booking.find()
            .populate('service', 'heading')
            .populate('assignedTo', 'username');

        const merchants = await User.find({ role: 'merchant' });

        res.json({
            status: true,
            title: 'booking',
            bookings,
            merchants,
            admin: req.admin,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: 'Server Error' });
    }
}

// Update booking status
updateBooking = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (status !== 'pending' && status !== 'completed') {
            return res.status(400).json({ status: false, message: 'Invalid status' });
        }

        // Update the order status
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // Return the updated document
        );

        res.json({
            status: true,
            message: 'Booking updated successfully',
            booking: updatedBooking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Server Error' });
    }
}

// Delete a booking
deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ status: false, message: 'Booking not found' });
        }

        // Delete the booking
        await Booking.findByIdAndDelete(bookingId);
        res.json({ status: true, message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Server Error' });
    }
}

// Route to handle the assignment of bookings to employees
assign_booking = async (req, res) => {
    const { bookingId, assignedTo } = req.body;

    try {
        // Ensure both bookingId and assignedTo are provided
        if (!bookingId || !assignedTo) {
            return res.status(400).json({ status: false, message: 'Booking ID and merchant must be specified' });
        }

        // Find the booking and update its assigned employee
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ status: false, message: 'Booking not found' });
        }

        // Verify that the employee exists
        const merchant = await User.findById(assignedTo);

        if (!merchant || merchant.role !== 'merchant') {
            return res.status(400).json({ status: false, message: 'Invalid merchant selected' });
        }

        // Update the booking with the new employee assignment
        booking.assignedTo = merchant._id;
        await booking.save();

        res.json({
            status: true,
            message: 'Booking assigned successfully',
            booking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Server Error' });
    }
}




    
}

module.exports = new adminController()