const Booking = require("../model/appoinment_booking");


class appoinment_bookingController{
 
//create booking
createBooking = async (req, res) => {
    const { location, service_date,time,name, service,phone, message} = req.body;
    try {

        if (!service_date) {
            return res.status(400).send('Service date is required.');
        }

        // Convert the service_date from "YYYY-MM-DD" format to a Date object
        const parsedDate = new Date(service_date);
        
        // Check if the date is valid
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).send('Invalid date.');
        }

        const newBooking = new Booking({
            service,
            location,
            service_date:parsedDate, // Convert to Date object,
            time,
            name,
            phone,
            message,
            user: req.user.id,
        });
        await newBooking.save();
       // Redirect to the payment page with necessary info
    res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}


cancelbooking = async (req, res) => {
    const { bookingId } = req.body;

    try {
        await Booking.findByIdAndUpdate(bookingId, { status: 'Cancelled' });
        res.redirect('/profile'); // Redirect back to the profile page
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

}

module.exports = new appoinment_bookingController()