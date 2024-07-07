const mongoose = require('mongoose');
const { Schema } = mongoose;

let User;
if (mongoose.models.User) {
    User = mongoose.model('User');
} else {
    const UserSchema = new Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        otp: { type: String },
        isActive: { type: Boolean, default: false },
        isAdmin: { type: Boolean, default: false },
        cartItems: { type: Array, default: [] },
        googleId: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        mobileNumber: { type: String },
        companyName: { type: String },
        streetAddress: { type: String },
        city: { type: String },
        postcode: { type: String },
        country: { type: String, default: 'India' },
        state: { type: String },
        currency: { type: String, default: 'INR' },
        date: { type: Date, default: Date.now },
    });

    User = mongoose.model('User', UserSchema);
}

module.exports = User;