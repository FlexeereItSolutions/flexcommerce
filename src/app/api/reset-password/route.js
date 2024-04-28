import { NextResponse } from "next/server";
import User from "../../../models/User";
import { createHash } from "../../../lib/utils";
import connectToDatabase from "../../../lib/connect";

export const POST = async (req) => {
    const { email, password } = await req.json()
    await connectToDatabase()
    let user = await User.findOne({ email: email })
    if (!user) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
    let hashedPassword = await createHash(password)
    let updatedUser = await User.updateOne({ email: email }, { "$set": { password: hashedPassword } })
    return NextResponse.json({ success: true, message: "Your password has been successfully reset. \nPlease log in with your new password." })

}