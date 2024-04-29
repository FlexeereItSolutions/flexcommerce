import { NextResponse } from "next/server";
import User from "../../../models/User";
import { checkHash } from "../../../lib/utils";
import jwt from 'jsonwebtoken'
import connectToDatabase from "../../../lib/connect";

export const POST = async(req) => {
    const { email, otp } = await req.json();
    await connectToDatabase()
    const user = await User.findOne({ email: email });
    let hashedOTP = user.otp
    let userId = user._id.toString();
    let isValid = await checkHash(otp, hashedOTP)
    if (isValid) {
        let user = await User.updateOne({ email: email }, { "$set": { isActive: true } })
        let jwtToken = jwt.sign(userId, process.env.JWT_SECRET)
        return NextResponse.json({ success: true, token: jwtToken })
    } else {
        return NextResponse.json({ success: false, 'message': 'Invalid OTP' })
    }
}