const User = require("../../../../module/user/model/userModel");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');




class merchantController{

    //merchant login view
loginview = async (req, res) => {
    try{    
       res.render("merchant/layouts/merchantLogin", {
        title: "login"
      });
  
    }catch(error){
      console.log(error);
    }
  };




    // merchant login
    merchantLogin = async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user.role === 'user' || user.role === 'admin') {
            return res.status(500).send('user and admin can not login in this page')
        }
        if (!user) return res.status(400).send('User not found');
        if (!user.isVerified) return res.status(400).send('Email not verified');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid password');

        const jwtToken = jwt.sign({ id: user._id, role: user.role,username:user.username },'ghcghvjyfyfmerchant', { expiresIn: '30d' });

        res.cookie('merchanttoken', jwtToken, { httpOnly: true, secure: false });
       return  res.redirect('/merchant/servicepage')
    };
    


    //logout -------------
    merchantlogout = async (req, res) => {
        try {
            res.clearCookie("merchanttoken");
            return res.redirect("/merchant/");
        } catch (error) {
            return res.status(500).json({  
                success: false,
                message: error.message
            });
        }
    }

}

module.exports = new merchantController()