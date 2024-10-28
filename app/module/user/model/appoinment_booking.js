
const mongoose = require('mongoose');

const appoinment_bookingSchema = new mongoose.Schema({

    location: { 
        type: String ,
        required: true 
    },
    service_date: {  
        type: Date, 
        required: true 
    },
    time: { 
        type: String 
    },
    name: { 
        type: String,
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    service: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'service' 
       },
   
    assignedTo: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User' 
        }, 
    status: { 
        type: String, 
        enum: ['pending', 'completed','cancelled'],   
        default: 'pending' 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
});

const Booking = mongoose.model('booking', appoinment_bookingSchema);

module.exports = Booking;
