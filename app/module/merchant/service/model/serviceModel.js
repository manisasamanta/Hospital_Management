
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    image: { 
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
     status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    title: { 
        type: String
     },
    heading2: { 
        type: String
     },
     description2: { 
        type: String
     },
     description3: { 
        type: String
     },

},
{timestamps:true}
);

const Service = mongoose.model('service', serviceSchema);

module.exports = Service;
