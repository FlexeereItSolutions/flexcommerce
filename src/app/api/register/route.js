import { NextResponse } from "next/server";
import User from "../../../models/User";
import { createHash, sendOTP } from "../../../lib/utils"
import connectToDatabase from "../../../lib/connect";

const POST = async (req) => {
    const { name, email, password } = await req.json();
    console.log(`POST ${name} ${email} ${password}`)
    await connectToDatabase()
    const user = await User.findOne({ email })
    if (user) {
        return NextResponse.json({ success: false, message: "Email already taken!" })
    }
    let otp = Math.floor(100000 + Math.random() * 900000)
    let hashedPassword = await createHash(password)
    let hashedOTP = await createHash(String(otp))
    const newUser = new User({ name: name.trim(), email: email.trim(), password: hashedPassword, otp: hashedOTP })
    await newUser.save()
    await sendOTP(email, otp)
    return NextResponse.json({ success: true })
}

export { POST }