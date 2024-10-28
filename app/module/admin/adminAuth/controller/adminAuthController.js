const User = require("../../../../module/user/model/userModel");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');




class adminController{

    //admin login view
loginview = async (req, res) => {
    try{    
       res.render("admin/layouts/adminLogin", {
        title: "login"
      });
  
    }catch(error){
      console.log(error);
    }
  };




    // admin login
    adminLogin = async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user.role === 'user' || user.role === 'merchant') {
            return res.status(500).send('user and merchant can not login in this page')
        }
        if (!user) return res.status(400).send('User not found');
        if (!user.isVerified) return res.status(400).send('Email not verified');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid password');

        const jwtToken = jwt.sign({ id: user._id, role: user.role,username:user.username },'ghcghvchgvhvvmjhadmin', { expiresIn: '30d' });

        res.cookie('admintoken', jwtToken, { httpOnly: true, secure: false });
       return  res.redirect('/admin/bannerpage')
    };
    


    //logout -------------
    adminlogout = async (req, res) => {
        try {
            res.clearCookie("admintoken");
            return res.redirect("/admin/");
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

}

module.exports = new adminController()