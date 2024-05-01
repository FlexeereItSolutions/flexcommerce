import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema({
    userId: String,
    item: Object,
    orderStatus: String,
    subtotal: Number,
    transactionNumber: String,
    payment_ss: String,
    ip_address: String,
    username: String,
    password: String,
    expiry_date: Date,
    date: {
        type: Date,
        default: Date.now
    }
})
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
module.exports = Order