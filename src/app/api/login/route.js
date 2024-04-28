import { NextResponse } from "next/server";
import User from "../../../models/User";
import { checkHash, sendOTP, createHash } from "../../../lib/utils";
import jwt from "jsonwebtoken"
import connectToDatabase from "../../../lib/connect"

export const POST = async (req) => {
    const { email, password, isAdmin } = await req.json();
    await connectToDatabase()
    console.log(`POST ${email} ${password} ${isAdmin}`)
    const user = await User.findOne({ email: email });
    if (!user) {
        return NextResponse.json({ success: false, message: "Invalid credentials" })

    }
    let hashedPassword = user.password
    let userId = user._id.toString();
    let isValid = await checkHash(password, hashedPassword)
    if (isValid) {
        if (isAdmin === true) {
            if (user.isAdmin) {
                let jwtToken = jwt.sign(userId, process.env.JWT_SECRET)
                return NextResponse.json({ success: true, token: jwtToken, verified: true })

            }
            else {
                return NextResponse.json({ success: false, message: "Invalid credentials" })

            }
        }
        if (!user.isActive) {
            let otp = Math.floor(100000 + Math.random() * 900000)
            let hashedOTP = await createHash(String(otp))
            await User.updateOne({ email: email }, { "$set": { otp: hashedOTP } })
            await sendOTP(email, otp)
            return NextResponse.json(({ success: true, verified: false }))

        }
        let jwtToken = jwt.sign(userId, process.env.JWT_SECRET)
        return NextResponse.json({ success: true, token: jwtToken, verified: true })
    }
    else {
        return NextResponse.json({ success: false, message: 'Invalid credentials' })
    }
}