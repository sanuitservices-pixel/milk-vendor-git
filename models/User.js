const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    quantity: { type: Number, require: true },
    price: { type: Number, require: true },
    walletBalance: { type: Number, default: 0 },
    ernings: { type: Number, default: 0 },
    milkSold: { type: Number, default: 0 },
    role: { type: String, enum: ['admin', 'vendor', 'customer', 'superadmin'], default: 'customer' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = model("User", UserSchema);