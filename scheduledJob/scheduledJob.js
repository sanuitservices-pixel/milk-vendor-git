const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path as necessary
const Order = require('../models/Order'); // Adjust the path as necessary


// This function contains the logic to create a new order
const createDailyOrder = async () => {
    // Cron Job Test
    const users = await User.find({ role: 'user' });
    const vendor = await User.find({ role: 'vendor' });
    // console.log(vendor[0]._id);
    try {
        users.forEach(element => {
            // console.log(element);
            const fixecdOrderDetails = {
                "vendor_id": vendor[0]._id,
                "user_id": element._id,
                "name": element.name,
                "mobile": element.mobile,
                "address": element.address,
                "quantity": element.quantity,
                "price": element.price,
                "status": "pending"
            }
            // console.log(fixecdOrderDetails);
            const newOrder = new Order(fixecdOrderDetails);
            newOrder.save();

        });
        // return res.status(201).json({ message: 'Order created successfully', success: true });
    } catch (err) {
        console.log(err);
    }

}



// This function initializes all your scheduled jobs
exports.initScheduledJobs = () => {
    // Schedule the task to run every day at midnight (00:00)
    // The cron expression '0 0 * * *' means:
    // Minute 0 | Hour 0 | Day of month * | Month * | Day of week *
    cron.schedule('0 0 * * *', createDailyOrder, {
        scheduled: true,
        timezone: 'Asia/Kolkata' // Set your desired timezone
    });
    console.log('Daily order creation job is scheduled.');
};