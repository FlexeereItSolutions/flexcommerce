import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema({
    payment_qr: String,
    date: {
        type: Date,
        default: Date.now
    }
})
const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
module.exports = Payment