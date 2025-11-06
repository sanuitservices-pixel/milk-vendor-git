const router = require('express').Router();

const { userRegister, userLogin, serializeUser, checkRole, userAuth } = require('../utils/Auth');
const { editUser, deleteUser, getVendorsList } = require('../utils/User');

// Admin Register Route
router.post('/register-admin', async (req, res) => {
    await userRegister(req.body, 'admin', res);
});

// Vendor Register Route
router.post('/register-vendor', async (req, res) => {
    await userRegister(req.body, 'vendor', res);
});

// Super Admin Register Route
router.post('/register-superadmin', async (req, res) => {
    await userRegister(req.body, 'superadmin', res);
});

// User Register Route
router.post('/register-user', async (req, res) => {
    await userRegister(req.body, 'customer', res);
});

// User Login Route
router.post('/login-user', async (req, res) => {
    await userLogin(req.body, 'customer', res);
});

//Admin Login Route
router.post('/login-admin', async (req, res) => {
    await userLogin(req.body, 'admin', res);
});

//Vendor Login Route
router.post('/login-vendor', async (req, res) => {
    await userLogin(req.body, 'vendor', res);
});

//Super Admin Login Route
router.post('/login-superadmin', async (req, res) => {
    await userLogin(req.body, 'superadmin', res);
});

// User profile Route
router.get('/profile', userAuth, async (req, res) => {
    return res.status(200).json({ user: serializeUser(req.user), success: true });
});

// User Protected Route
router.get('/user-protected', userAuth, checkRole(['user']), async (req, res) => {
    res.status(200).json({ message: 'User Content', success: true });
});

// Admin Protected Route
router.get('/admin-protected', async (req, res) => { });

// Vendor Protected Route
router.get('/vendor-protected', async (req, res) => { });

// Super Admin Protected Route
router.get('/superadmin-protected', async (req, res) => { });

// Edit User
router.put('/edit-user/:userId', async (req, res) => {
    await editUser(req.params.userId, req.body, res);
});

// delete customer
router.delete('/delete-user/:userId', async (req, res) => {
    // Implement logic to delete a customer
    await deleteUser(req.params.userId, res);
});

router.get('/get-vendors', async (req, res) => {
    // Implement logic to get vendors for superadmin
    await getVendorsList(req, res);
});

module.exports = router;