const Order = require('../models/Order');
const User = require('../models/User');

const editUser = async (userId, body, res) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        user.name = body.name || user.name;
        user.mobile = body.mobile || user.mobile;
        user.address = body.address || user.address;
        user.quantity = body.quantity || user.quantity;
        user.role = body.role || user.role;
        user.password = body.password || user.password;
        user.price = body.price || user.price;
        user.walletBalance = body.walletBalance || user.walletBalance;
        await user.save();
        return res.status(200).json({ message: 'User updated successfully', success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to update user', success: false, error: err.message });
    }
}

// delete user
const deleteUser = async (userId, res) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'Customer not found', success: false });
        }
        await Order.deleteMany({ user_id: userId });
        return res.status(200).json({ message: 'Customer deleted successfully', success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to delete customer', success: false, error: err.message });
    }

}

const getVendorsList = async (req, res) => {
    try {
        const vendors = await User.find({ role: 'vendor' });
        return res.status(200).json({ vendors, success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch vendors', success: false, error: err.message });
    }
}

module.exports = {
    editUser,
    deleteUser,
    getVendorsList
}