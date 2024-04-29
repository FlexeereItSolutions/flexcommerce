import { headers } from "next/headers"
import jwt from "jsonwebtoken"
import User from "../../../models/User"
import { NextResponse } from "next/server"
import connectToDatabase from "../../../lib/connect"
export const POST = async(req) => {
    const { token } = new headers(req.headers)
    console.log(`POST ${token}`)
    await connectToDatabase()
    try {
        let isTokenValid = jwt.verify(token, process.env.JWT_SECRET)
        let id = jwt.decode(token, process.env.JWT_SECRET)
        let user = await User.findOne({ "_id": id })
        if (isTokenValid) {
            return NextResponse.json({ userValid: true, userName: user.name, isAdmin: user.isAdmin })
        } else {
            return NextResponse.json({ userValid: false })
        }
    } catch {
        return NextResponse.json({ userValid: false })
    }
}