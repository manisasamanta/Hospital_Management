const User = require("../../module/user/model/userModel");
const serviceRepository = require("../../module/merchant/service/repository/serviceRepository");
const Booking = require("../../module/user/model/appoinment_booking");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');





class MerchantApiController {

    // Merchant login
    merchantLogin = async (req, res) => {
        try {
            console.log(req.body)
            const { email, password } = req.body;

            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ status: false, message: 'User not found' });
            }

            // Check user role
            if (user.role === 'user' || user.role === 'admin') {
                return res.status(403).json({ status: false, message: 'User and admin cannot login on this page' });
            }

            // Check if the email is verified
            if (!user.isVerified) {
                return res.status(400).json({ status: false, message: 'Email not verified' });
            }

            // Validate the password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ status: false, message: 'Invalid password' });
            }

            // Generate JWT token
            const jwtToken = jwt.sign(
                { id: user._id, role: user.role, username: user.username },
                'ghcghvjyfyfmerchant',
                { expiresIn: '30d' }
            );

            // Return success response
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
            

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    };



//************* service  ****************/


// Create a new service
async createService(req, res) {
    try {
        const merchantId = req.merchant.id;
        console.log('merchantId:',merchantId);
        
        const result = await serviceRepository.createService(req.body,req.file,merchantId);

        return res.json({
            status: true,
            message: 'Service created successfully',
            data: result 
        });
    } catch (err) {
        console.error(err);
        return res.json({
            status: false,
            message: 'An error occurred while creating the service',
            error: err.message 
        });
    }
}


  // Update a service
  async updateService(req, res) {
    const id = req.params.id;
    try {
        const merchantId = req.merchant.id;
        const result = await serviceRepository.updateService(id, req.body, req.file,merchantId);
        return res.json({
            status: true,
            message: 'Service updated successfully',
            data: result 
        });
    } catch (err) {
        console.error(err);
        return res.json({
            status: false,
            message: 'An error occurred while updating the service',
            error: err.message 
        });
    }
}

// Delete a service
async deleteService(req, res) {
    const id = req.params.id;
    try {
        const result = await serviceRepository.deleteService(id);
        return res.json({
            status: true,
            message: 'Service deleted successfully',
            data: result 
        });
    } catch (err) {
        console.error(err);
        return res.json({
            status: false,
            message: 'An error occurred while deleting the service',
            error: err.message 
        });
    }
}


//********************* booking  ***************/

bookings = async (req, res) => {
    try {
        const merchant = await User.findById(req.merchant.id);
        
        // Fetch bookings assigned to the merchant
        const bookings = await Booking.find({ 
            assignedTo: merchant._id 
        }).populate('service');

        // Send a JSON response
        res.json({
            status: true,
            message: "Bookings retrieved successfully",
            merchant: req.merchant,
            bookings
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
};




}

module.exports = new MerchantApiController();
 