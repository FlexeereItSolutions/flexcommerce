"use server"

import User from "../models/User";
import Order from "../models/Order";
import { checkHash, createHash, sendOTP } from "../lib/utils";
import connectToDatabase from "../lib/connect";
import jwt from "jsonwebtoken"
import Product from "../models/Product";

const resendOTP = async (email) => {
    await connectToDatabase()
    let user = await User.findOne({ email: email })
    if (!user) {
        return { success: false, message: "User not found" }
    }
    let otp = Math.floor(100000 + Math.random() * 900000)
    const hashedOTP = await createHash(String(otp))
    await User.updateOne({ email: email }, { "$set": { otp: hashedOTP } })
    await sendOTP(email, otp)
    return { success: true, message: "OTP has been sent to your email" }
}

const sendVerificationOTP = async (email) => {
    await connectToDatabase()
    let user = await User.findOne({ email: email })
    if (!user) {
        return { success: false, message: "User not found" }
        return;
    }
    let otp = Math.floor(100000 + Math.random() * 900000)
    const hashedOTP = await createHash(String(otp))
    await User.updateOne({ email: email }, { "$set": { otp: hashedOTP } })
    await sendPasswordResetOTP(email, otp, user.name.toString())
    return { success: true, message: "OTP has been send to your email" }
}


const verifyOTP = async (email, otp) => {
    await connectToDatabase()
    console.log(`Verifying email: ${email} with otp: ${otp}`)
    const user = await User.findOne({ email: email });
    // console.log(user)
    const userid = user._id.toString()
    console.log("User id", userid)
    let hashedOTP = user.otp
    let isValid = await checkHash(otp, hashedOTP)
    if (isValid) {
        let user = await User.updateOne({ email: email }, { "$set": { isActive: true } })
        let jwtToken = jwt.sign(userid, process.env.JWT_SECRET)
        return { success: true, token: jwtToken }
    }
    else {
        return { success: false, message: 'Invalid OTP' }
    }
}

const verifyUser = async (token) => {
    await connectToDatabase()
    try {
        let isTokenValid = jwt.verify(token, process.env.JWT_SECRET)
        if (isTokenValid) {
            let id = jwt.decode(token, process.env.JWT_SECRET)
            let user = await User.findOne({ "_id": id })
            return { userValid: true, userName: user.name, isAdmin: user.isAdmin }
        }
        else {
            return { userValid: false }
        }
    }
    catch {
        return { userValid: false }
    }
}

const deleteProduct = async (id, token) => {
    try {
        const data = await verifyUser(token)
        if (data.userValid && data.isAdmin) {
            await Product.findByIdAndDelete(id)
            return { success: true, message: "Product deleted successfully" }
        }
        else {
            return { success: false, message: "Action not allowed" }
        }
    }
    catch {
        return { success: false, message: "Something went wrong!" }
    }
}

const updateProduct = async (id, newProduct, token) => {
    const data = await verifyUser(token)
    if (data.userValid && data.isAdmin) {
        const newP = await Product.findByIdAndUpdate(id, { $set: newProduct })
        return { success: true, message: "Product updated successfully" }
    }
    else {
        return { success: false, message: "Action not Allowed" }
    }
}

const getProducts = async () => {
    await connectToDatabase()
    const products = await Product.find({}).sort()
    return products
}

const fetchProduct = async (id) => {
    await connectToDatabase()
    console.log(id)
    const product = await Product.findById(id)
    return { _id: product._id.toString(), name: product.name.toString(), price: product.price.toString(), description: product.description.toString(), image: product.image.toString() }
}

const addToCart = async (id, token) => {
    const data = await verifyUser(token)
    if (data.userValid) {
        let userid = jwt.decode(token, process.env.JWT_SECRET)
        await connectToDatabase()
        const user = await User.findById(userid)
        for (let item of user.cartItems) {
            console.log(item._id, id)
            if (item._id == id) return { success: true, message: 'Item already in cart' }
        }
        const product = await Product.findById(id)
        const newUser = await User.findByIdAndUpdate(userid, { $set: { cartItems: [product, ...user.cartItems] } })
        return { success: true, message: "Added to Cart" }
    }
    else {
        return { success: false, message: "Action not allowed" }
    }
}
const removeFromCart = async (id, token) => {
    const data = await verifyUser(token)
    if (data.userValid) {
        let userid = jwt.decode(token, process.env.JWT_SECRET)
        await connectToDatabase()
        const user = await User.findById(userid)
        const product = await Product.findById(id)
        const newItems = user.cartItems.filter(item => item._id != id)
        const newUser = await User.findByIdAndUpdate(userid, { $set: { cartItems: newItems } })
        return { success: true, message: "Item Removed from Cart" }
    }
    else {
        return { success: false, message: "Action not allowed" }
    }
}

const fetchCart = async (token) => {
    const data = await verifyUser(token)
    if (data.userValid) {
        let userid = jwt.decode(token, process.env.JWT_SECRET)
        await connectToDatabase()
        const user = await User.findById(userid)
        return { success: true, cart: user.cartItems }
    }
    return { success: false, message: "Action not allowed" }
}


const fetchOrders = async (token) => {
    const data = await verifyUser(token)
    if (data.userValid) {
        let userid = jwt.decode(token, process.env.JWT_SECRET)
        await connectToDatabase()
        const orders = await Order.find({ userId: userid }).sort("-date")
        return { success: true, orders: orders }
    }
    return { success: false, message: "Action not allowed" }

}

const fetchAdminOrders = async (token) => {
    const data = await verifyUser(token)
    if (data.userValid && data.isAdmin) {
        await connectToDatabase()
        const orders = await Order.find({}).sort("-date")
        return { success: true, orders: orders }
    }
    return { success: false, message: "Action not allowed" }

}

const fetchOrder = async (id, token) => {
    const data = await verifyUser(token)
    if (data.userValid) {
        await connectToDatabase()
        const order = await Order.findById(id)
        return { success: true, order: order }
    }
    return { success: false, message: "Action not allowed" }

}

const acceptOrder = async (orderid, token, ip, username, password) => {
    const data = await verifyUser(token)
    if (data.userValid) {
        await connectToDatabase()
        const order = await Order.findByIdAndUpdate(orderid, { $set: { ip_address: ip, username: username, password: password, orderStatus: "Accepted" } })
        return { success: true, message: "Order Accepted" }
    }
    return { success: false, message: "Action not allowed" }
}

const fetchUsers = async (token) => {
    const data = await verifyUser(token)
    if (data.userValid && data.isAdmin) {
        await connectToDatabase()
        const users = await User.find({})
        return { success: true, users: users }
    }
    return { success: false, message: "Action not allowed" }

}

const fetchUserOrders = async (userid, token) => {
    const data = await verifyUser(token)
    if (data.userValid && data.isAdmin) {
        await connectToDatabase()
        const orders = await Order.find({ userId: userid }).sort("-date")
        return { success: true, orders: orders }
    }
    return { success: false, message: "Action not allowed" }

}

const updateUser = async (user, token, userid) => {
    const data = await verifyUser(token)
    if (data.userValid && data.isAdmin) {
        await connectToDatabase()
        const u = await User.findOne({ email: user.email })
        if (u && u._id != userid) {
            return { success: false, message: "Email already taken" }
        }
        else {
            await User.findByIdAndUpdate(userid, { $set: user })
            return { success: true, message: "User details updated successfully" }
        }
    }
    else {
        return { success: false, message: "Action not allowed" }
    }
}

export { sendVerificationOTP, verifyOTP, resendOTP, verifyUser, deleteProduct, fetchProduct, getProducts, addToCart, fetchCart, removeFromCart, fetchOrders, fetchAdminOrders, fetchOrder, acceptOrder, fetchUsers, fetchUserOrders, updateUser }