const mongoose = require('mongoose')
const { Schema } = require('mongoose')

let User;
if (mongoose.models.User) {
    User = mongoose.model('User');
} else {
    const UserSchema = new Schema({
        name: String,
        email: String,
        password: String,
        otp: String,
        isActive: { type: Boolean, default: false },
        isAdmin: { type: Boolean, default: false },
        cartItems: { type: Array, default: [] },
        date: { type: Date, default: Date.now }
    })
    User = mongoose.model('User', UserSchema);
}
export default User