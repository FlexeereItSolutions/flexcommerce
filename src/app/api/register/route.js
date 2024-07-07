import { NextResponse } from "next/server";
import User from "../../../models/User";
import { createHash, sendOTP } from "../../../lib/utils";
import connectToDatabase from "../../../lib/connect";

const POST = async(req) => {
    const { name, email, password } = await req.json();
    console.log(`POST ${name} ${email} ${password}`);
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (user) {
        if (!user.isActive) {
            return NextResponse.json({
                success: false,
                message: "Your account is not verified. Please check your email for the verification link or contact support services for assistance.",
                type: "UNVERIFIED_ACCOUNT"
            });
        }
        return NextResponse.json({ success: false, message: "Email already taken!" });
    }

    let otp = Math.floor(100000 + Math.random() * 900000);
    let hashedPassword = await createHash(password);
    let hashedOTP = await createHash(String(otp));

    const newUser = new User({
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        otp: hashedOTP,
        isActive: false // Set to false initially, will be set to true when verified
    });

    try {
        await newUser.save();
        await sendOTP(email, otp);
    } catch (error) {
        // If saving user or sending OTP fails, delete the user if it was created
        if (newUser._id) {
            await User.deleteOne({ _id: newUser._id });
        }
        return NextResponse.json({
            success: false,
            message: "Unable to create account or send verification email. Please try again later or contact support services.",
            type: "REGISTRATION_FAILURE"
        });
    }

    return NextResponse.json({ success: true, message: "Account created successfully. Please check your email to verify your account." });
};

export { POST };