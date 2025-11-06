const router = require('express').Router();

const {
    createOrder,
    getOrders,
    totalSaleOfMonth,
    getTodaysOrders,
    setOrderStatus,
    serializeOrder,
    totalSaleOfThisMonth,
    incameOfThisMonth,
    getVendorOrders,
    getAllOrders
} = require('../utils/Order');
const { userAuth, checkRole } = require('../utils/Auth');

// create order
// middlewares to use userAuth, checkRole(['user'])
router.post('/create-order', async (req, res) => {
    await createOrder(req.body, res);
});

// get orders
// middlewares to use userAuth, checkRole(['admin', 'vendor'])
router.get('/get-orders', userAuth, async (req, res) => {
    await getOrders(req.user._id, res);
});

// get orders
// middlewares to use userAuth, checkRole(['admin', 'vendor'])
router.get('/get-vendor-orders', userAuth, async (req, res) => {
    await getVendorOrders(req.user._id, res);
});

// milk sold last month
// middlewares to use userAuth, checkRole(['admin', 'vendor'])
router.get('/milk-sold-last-month', async (req, res) => {
    // Implement logic to get milk sold last month
    await totalSaleOfMonth(req.body, res);
});

// milk sold this month
// middlewares to use userAuth, checkRole(['admin', 'vendor'])
router.get('/milk-sold-this-month', async (req, res) => {
    // Implement logic to get milk sold this month
    await totalSaleOfThisMonth(req.body, res);
});

//vendor earnings last month
// middlewares to use userAuth, checkRole(['vendor'])
router.get('/earnings-this-month', async (req, res) => {
    // Implement logic to get vendor earnings last month
    await incameOfThisMonth(req.body, res);
});

// get pending orders
// middlewares to use userAuth, checkRole(['vendor'])
router.get('/pending-orders', async (req, res) => {
    // Implement logic to get pending orders
    await getTodaysOrders(req.body, res);
});

// update order status
// middlewares to use userAuth, checkRole(['vendor'])
router.put('/update-order-status/:orderId', async (req, res) => {
    // Implement logic to update order status
    await setOrderStatus(req, res);
});

// get Orders
router.get('/get-all-orders', async (req, res) => {
    // Implement logic to get orders
    await getAllOrders(req.body, res);
});


module.exports = router;