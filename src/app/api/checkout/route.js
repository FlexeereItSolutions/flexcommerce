import { v2 as cloudinary } from 'cloudinary';
import Order from '../../../models/Order';
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server';
import User from '../../../models/User';
import connectToDatabase from '../../../lib/connect';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const POST = async (req) => {
    const formData = await req.formData()
    const token = formData.get('token')
    const isValid = jwt.verify(token, process.env.JWT_SECRET)
    if (!isValid) {
        return NextResponse.json({ success: false, message: "User not logged in" })
    }
    const userid = jwt.decode(token, process.env.JWT_SECRET)
    const transactionNumber = formData.get('transactionNumber')
    const ss = formData.get("ss")
    try {
        const file = await ss.arrayBuffer()
        const base64 = Buffer.from(file).toString('base64')
        const uploadedImage = await cloudinary.uploader.upload(`data:${ss.type};base64,${base64}`)

        // upload to cloudinary with the mimetype ad from the file
        await connectToDatabase()
        const user = await User.findById(userid)
        const cartItems = user.cartItems
        for (let item of cartItems) {
            const order = await Order.create({
                userId: userid,
                item: item,
                orderStatus: "Pending",
                subtotal: item.price,
                transactionNumber,
                payment_ss: uploadedImage.secure_url
            })
            await order.save()
        }
        await User.findByIdAndUpdate(userid, { cartItems: [] })
        return NextResponse.json({ success: true, message: "Successfully placed order" })
    }
    catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong!" })
    }
}