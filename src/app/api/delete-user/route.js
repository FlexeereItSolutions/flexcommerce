// app/api/delete-user/route.js

import { NextResponse } from 'next/server';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../lib/connect'; // Adjust this import path as needed

export async function DELETE(req) {
    await connectToDatabase();

    const userId = req.nextUrl.searchParams.get('userId');
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Verify the token and check if the user is an admin
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.isAdmin) {
            return NextResponse.json({ success: false, message: "Action not allowed" }, { status: 403 });
        }

        // Delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}