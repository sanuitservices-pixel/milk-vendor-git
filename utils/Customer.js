const Order = require('../models/Order');
const User = require('../models/User');

const updateWalletBalance = async (customerId, body, res) => {
    try {
        // console.log(customerId, body);
        // Assuming Customer model is defined and imported
        const user = await User.findById(customerId);
        if (!user) {
            return res.status(404).json({ message: 'Customer not found', success: false });
        }
        if (body.type === 'credit') {
            user.walletBalance += body.amount;
        } else if (body.type === 'debit') {
            if (user.walletBalance < body.amount) {
                return res.status(400).json({ message: 'Insufficient wallet balance', success: false });
            }
            user.walletBalance -= body.amount;
        } else {
            return res.status(400).json({ message: 'Invalid transaction type', success: false });
        }
        user.address = body.address || user.address;
        await user.save();
        return res.status(200).json({ message: 'Wallet balance updated successfully', success: true, walletBalance: user.walletBalance });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to update wallet balance', success: false, error: err.message });
    }
}

const getOrderHistory = async (customerId, res) => {
    try {
        const orders = await Order.find({ user_id: customerId });
        return res.status(200).json({ orders, success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch order history', success: false, error: err.message });
    }
}

const getVendorOrderHistory = async (vendorId, res) => {
    try {
        const orders = await Order.find({ vendor_id: vendorId });
        return res.status(200).json({ orders, success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch vendor order history', success: false, error: err.message });
    }
}

const getCustomersList = async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' });
        return res.status(200).json({ customers, success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch customers', success: false, error: err.message });

    }
}



module.exports = {
    updateWalletBalance,
    getOrderHistory,
    getVendorOrderHistory,
    getCustomersList,
}
