const User = require("../../module/user/model/userModel");
const Booking = require("../../module/user/model/appoinment_booking");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');



class userApiController{

//user signup --------------------
signup = async (req, res) => {
    try {
        const { username, email, password} = req.body;

        // Check if email already exists
        const existemail = await User.findOne({ email });
        if (existemail) {
            return res.status(400).json('Email already exists, kindly try with another email');
        }

        // console.log(req.body);

        // Generate OTP and hash password
        const otp = generateOTP();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpires: Date.now() + 15 * 60 * 1000 // OTP valid for 15 minutes
        });

        // Save the new user
        await newUser.save();

        // Send OTP via email
        try {
            await sendOTP(email, otp);
        } catch (emailError) {
            console.error('Error sending OTP:', emailError.message);
            // Optionally, handle the error by responding to the user
            return res.status(500).json('Error sending OTP. Please try again later.');
        }

        // Create a token for the user
        try {
            const token = new tokenModel({
                _userId: newUser._id,
                token: crypto.randomBytes(16).toString('hex')
            });

            await token.save();
        } catch (tokenError) {
            console.error('Error saving token:', tokenError.message);
            // Optionally, handle the error by responding to the user
            return res.status(500).json('Error creating token. Please try again later.');
        }

        res.status(201).json({
            status: true,
            data:{
              username: user.username,
              email: user.email,
              roleName: user.role
            },
            message: "user created successfully"
          })
    } catch (error) {
        console.error('Error creating user:', error);
       res.status(500).json({
            status:false,
            message:error.message
          });
    }
}


// verify Otp

verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(500).json('Invalid or expired OTP.');
        }

        if (user.otp === otp) {
            user.isVerified = true
            user.otp = undefined
            user.otpExpires = undefined;
            await user.save();
        }

        return res.status(200).json({
            status: true,
            message: 'OTP successfully verified'
        });

    } catch (err) {
        return res.status(500).send(err.message);
    }
}



// login
Login = async (req, res) => {
    try{

        const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user.role === 'admin'||user.role === 'merchant') {
        return res.status(500).send('admin and merchant can not login in this page')
    }
    if (!user) return res.status(400).send('User not found');
    if (!user.isVerified) return res.status(400).json('Email not verified');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json('Invalid password');

    const jwtToken = jwt.sign({ id: user._id, role: user.role,username:user.username,email:user.email }, 'ghjgfhwmhfvvfgvuser', { expiresIn: '30d' });

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
        console.error('Login Error:', error.message); // Log the error message for debugging
        return res.status(500).json({ status: false, message: "Server Error" });
    }
};



//*************** booking  *****************/

createBooking = async (req, res) => {
    const { location, service_date, time, name, service, phone, message } = req.body;
    try {
        if (!service_date) {
            return res.status(400).json({ message: 'Service date is required.' });
        }

        // Convert the service_date from "YYYY-MM-DD" format to a Date object
        const parsedDate = new Date(service_date);
        
        // Check if the date is valid
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date.' });
        }

        const newBooking = new Booking({
            service,
            location,
            service_date: parsedDate, // Convert to Date object
            time,
            name,
            phone,
            message,
            user: req.user.id,
        });

        await newBooking.save();

        // Respond with success message and booking details
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}





}

module.exports = new userApiController()