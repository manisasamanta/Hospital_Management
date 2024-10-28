
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    sub_heading: { 
        type: String,
        required: true 
    },
    heading: { 
        type: String, 
        required: true
     },
     description: { 
        type: String, 
        required: true
     },
     image: { 
        type: String, 
        required: true
     },
     status:{
        type:Boolean,
        default:false
    }
    
},
{timestamps:true}
);

const Banner = mongoose.model('banner', bannerSchema);

module.exports = Banner;
