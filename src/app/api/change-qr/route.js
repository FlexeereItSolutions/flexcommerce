import { v2 as cloudinary } from 'cloudinary';
import Payment from '../../../models/Payment';
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server';
import User from '../../../models/User';
import connectToDatabase from '../../../lib/connect';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const POST = async(req) => {
    try {
        const formData = await req.formData();
        const token = formData.get('token');
        const isValid = jwt.verify(token, process.env.JWT_SECRET);
        if (!isValid) {
            return NextResponse.json({ success: false, message: "User not logged in" });
        }
        const userid = jwt.decode(token, process.env.JWT_SECRET);
        const qr_image = formData.get('qr_image');

        if (!qr_image) {
            return NextResponse.json({ success: false, message: "No image provided" });
        }

        const file = await qr_image.arrayBuffer();
        const base64 = Buffer.from(file).toString('base64');
        const mimeType = qr_image.type; // Get the MIME type of the uploaded image

        console.log("before cloudinary");
        const uploadedImage = await cloudinary.uploader.upload(`data:${mimeType};base64,${base64}`);
        console.log("after cloudinary");

        await connectToDatabase();
        console.log("after mongo");
        const old_qr = await Payment.find({});
        if (old_qr.length > 0) {
            const qr = await Payment.updateMany({}, { payment_qr: uploadedImage.secure_url });
        } else {
            const qr = new Payment({ payment_qr: uploadedImage.secure_url });
            await qr.save();
        }
        return NextResponse.json({ success: true, message: "Successfully saved QR Code" });
    } catch (error) {
        console.error('Error uploading QR code:', error);
        return NextResponse.json({ success: false, message: "Something went wrong!", error: error.message });
    }
};