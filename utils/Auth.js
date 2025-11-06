const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env.JWT_SECRET;
const passport = require('passport');

// Middleware to check if user is authenticated
const userRegister = async (req, role, res) => {
    try {
        // validate mobile
        let mobileExists = await ValidateMobile(req.mobile);
        if (!mobileExists) {
            return res.status(400).json({ message: 'Mobile number already exists', success: false });
        }

        const hashPassword = await bcrypt.hash(req.password, 12);

        const newUser = new User({
            ...req,
            password: hashPassword,
            role
        });

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully', success: true });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to register', success: false, error: err.message });
    }
}

const userLogin = async (req, role, res) => {
    let { mobile, password } = req;

    try {
        // Check if user exists
        let user = await User.findOne({ mobile, role })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }
        // Check if password matches
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }
        // Return success response
        let token = jwt.sign({
            id: user._id,
            role: user.role,
            mobile: user.mobile,
        }, process.env.JWT_SECRET, { expiresIn: '1 days' });

        let result = {
            mobile: user.mobile,
            role: user.role,
            token: `Bearer ${token}`,
            walletBalance: user.walletBalance,
            ernings: user.ernings,
            milkSold: user.milkSold,
            address: user.address,
            quantity: user.quantity,
            expiresIn: 168
        }
        return res.status(200).json({ message: 'Login successful', success: true, result });
    } catch (err) {
        return res.status(500).json({ message: 'Unable to login', success: false, error: err.message });
    }
}

// Passport Middleware to check if user is authenticated
const userAuth = passport.authenticate('jwt', { session: false });

// Function to check role authorization
const checkRole = roles =>
    (req, res, next) =>
        !roles.includes(req.user.role) ?
            res.status(401).json({ message: 'Unauthorized' }) :
            next();

const ValidateMobile = async mobile => {
    let user = await User.findOne({ "mobile": mobile });
    return user ? false : true;
}

const serializeUser = user => {
    return {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        walletBalance: user.walletBalance,
        ernings: user.ernings,
        milkSold: user.milkSold,
        address: user.address,
        quantity: user.quantity,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
    }
}

module.exports = {
    userAuth,
    userRegister,
    userLogin,
    serializeUser,
    checkRole
}

