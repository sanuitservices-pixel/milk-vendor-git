const router = require('express').Router();

const { updateWalletBalance, deleteUser, getOrderHistory, getVendorOrderHistory, getCustomersList } = require('../utils/Customer');
const { getVendorsList } = require('../utils/User');

// Customer wallet balance update
router.put('/update-wallet/:customerId', async (req, res) => {
    // Implement logic to update customer wallet balance
    await updateWalletBalance(req.params.customerId, req.body, res);
});
// Customer order history
router.get('/order-history/:customerId', async (req, res) => {
    // Implement logic to get customer order history
    await getOrderHistory(req.params.customerId, res);
});

// Customer order history
router.get('/vendor-order-history/:vendorId', async (req, res) => {
    // Implement logic to get customer order history
    console.log(req.params.customerId);
    await getVendorOrderHistory(req.params.vendorId, res);
});

// Get customers for superadmin
router.get('/get-customers', async (req, res) => {
    // Implement logic to get customers for superadmin
    await getCustomersList(req, res);
});





module.exports = router;