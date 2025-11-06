const Order = require('../models/Order');
const User = require('../models/User')


// create order
const createOrder = async (orderData, res) => {
    // Create Single Order
    try {
        const newOrder = new Order(orderData);
        await newOrder.save();
        return res.status(201).json({ message: 'Order created successfully', success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to create order', success: false, error: err.message });
    }
}

const getOrders = async (req, res) => {
    // console.log(req);
    try {
        const orders = await Order.find({ "user_id": req.user_id }).limit(10);
        return res.status(200).json({ orders, success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch orders', success: false, error: err.message });
    }
}

const getVendorOrders = async (req, res) => {
    // console.log(req);
    try {
        const orders = await Order.find({ "vendor_id": req, "status": ["delivered", "rejected"] }).limit(10);
        return res.status(200).json({ orders, success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch orders', success: false, error: err.message });
    }
}

const totalSaleOfThisMonth = async (req, res) => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    try {
        const totalSales = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: monthStart,
                        $lt: monthEnd
                    },
                    status: "delivered"
                }
            },
            {
                $group: {
                    _id: null,
                    totalSale: { $sum: "$quantity" }
                }
            }
        ]);
        return res.status(200).json({ totalSales: totalSales[0]?.totalSale || 0, success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch total sales', success: false, error: err.message });
    }
}

const totalSaleOfMonth = async (req, res) => {
    const today = new Date();
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
    try {
        const totalSales = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: lastMonthStart,
                        $lt: lastMonthEnd
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSale: { $sum: "$quantity" }
                }
            }
        ]);
        return res.status(200).json({ totalSales: totalSales[0]?.totalSale || 0, success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch total sales', success: false, error: err.message });
    }
}

const incameOfThisMonth = async (req, res) => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    try {
        const totalIncome = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: monthStart,
                        $lt: monthEnd
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$quantity" }
                }
            }
        ]);
        return res.status(200).json({ totalIncome: totalIncome[0]?.totalIncome * process.env.MARGIN || 0, success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch total income', success: false, error: err.message });
    }
}

const getTodaysOrders = async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    try {
        const orders = await Order.find({
            status: 'pending',
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });
        return res.status(200).json({ orders, success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch today\'s orders', success: false, error: err.message });
    }
}

const setOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found', success: false });
        }
        const customer = await Customer.findById(order.customer);
        if (!customer || !customer.fcmToken) {
            return res.status(404).json({ message: 'Customer or FCM token not found for this order.', success: false });
        }

        order.user_id = orderId
        order.status = status;
        await order.save();
        const message = {
            notification: {
                title: 'Order Status Updated',
                body: `Order Delivered`

            },
            token: customer.fcmToken
        };
        console.log(message);
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);

        return res.status(200).json({ message: 'Order status updated successfully', success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to update order status', success: false, error: err.message });
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json({ orders, success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch orders', success: false, error: err.message });
    }

}
module.exports = {
    createOrder,
    getOrders,
    totalSaleOfMonth,
    getTodaysOrders,
    setOrderStatus,
    totalSaleOfThisMonth,
    incameOfThisMonth,
    getVendorOrders,
    getAllOrders
};
