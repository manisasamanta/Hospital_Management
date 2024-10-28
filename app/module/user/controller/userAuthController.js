const User = require('../model/userModel');
const tokenModel = require('../model/tokenModel');

const bcrypt = require('bcryptjs');
const sendOTP = require('../../../helper/mailer');
const jwt = require('jsonwebtoken');
const crypto=require('crypto')
const generateOTP = require('../../../helper/otpgenerate');

class userAuthController{

 //user signup --------------------
 signup = async (req, res) => {
    try {
        const { username, email, password} = req.body;

        // Check if email already exists
        const existemail = await User.findOne({ email });
        if (existemail) {
            return res.status(400).send('Email already exists, kindly try with another email');
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
            return res.status(500).send('Error sending OTP. Please try again later.');
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
            return res.status(500).send('Error creating token. Please try again later.');
        }

        // Redirect to OTP verification page
        res.redirect('/otp/verify');
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}


// verify Otp

verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(500).send('Invalid or expired OTP.');
        }

        if (user.otp === otp) {
            user.isVerified = true
            user.otp = undefined
            user.otpExpires = undefined;
            await user.save();
        }

        return res.redirect('/login')

    } catch (err) {
        return res.status(500).send(err.message)
    }
}


// login
Login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user.role === 'admin'||user.role === 'merchant') {
        return res.status(500).send('admin and merchant can not login in this page')
    }
    if (!user) return res.status(400).send('User not found');
    if (!user.isVerified) return res.status(400).send('Email not verified');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    const jwtToken = jwt.sign({ id: user._id, role: user.role,username:user.username,email:user.email }, 'ghjgfhwmhfvvfgvuser', { expiresIn: '30d' });

    res.cookie('usertoken', jwtToken, { httpOnly: true, secure: true });
   return  res.redirect('/')
};



//confirmation------
confirmation = async (req, res) => {
    try {
        // Find the token
        const token = await tokenModel.findOne({ token: req.params.token });

        if (!token) {
            console.log("Verification link may be expired");
            req.flash("message1", "Verification link may be expired");
            return res.redirect("/signin");
        }

        // Find the user associated with the token
        const user = await User.findOne({ _id: token._userId, email: req.params.email });

        if (!user) {
            req.flash("message1", "User not found");
            return res.redirect("/signin");
        }

        if (user.isVerified) {
            req.flash("message1", "User is already verified");
            return res.redirect("/signin");
        }

        // Verify the user
        user.isVerified = true;
        await user.save();

        req.flash("message1", "User verified successfully");
        res.redirect("/signin");

    } catch (err) {
        console.error("Something went wrong:", err);
        req.flash("message1", "An error occurred. Please try again.");
        res.redirect("/signin");
    }
};

 
//logout -------------
logout = async (req, res) => {
    try {
        res.clearCookie("usertoken");
        return res.redirect("/login");
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



}

module.exports = new userAuthController()