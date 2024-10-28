
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true 
    },
    email: { 
        type: String,
        required: true 
    },
    password: { 
        type: String, 
        required: true 
     },
    role: { 
        type: String,
        enum: ['admin', 'merchant', 'user'], 
        default:'user' 
    },
    booking:{
        type: mongoose.Schema.Types.ObjectId, 
         ref: 'booking' 
    },
    services: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'service' 
    }],
    otp:{
        type:String
    }
    ,
    otpExpires:{
        type:Date
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    }
},{timestamps:true});

const User = mongoose.model('User', userSchema);

module.exports = User;
