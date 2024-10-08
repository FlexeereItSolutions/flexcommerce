"use server"

import User from "../models/User";
import Order from "../models/Order";
import Payment from "../models/Payment"
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
    } else {
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
        } else {
            return { userValid: false }
        }
    } catch {
        return { userValid: false }
    }
}

const deleteProduct = async (id, token) => {
    try {
        const data = await verifyUser(token)
        if (data.userValid && data.isAdmin) {
            await Product.findByIdAndDelete(id)
            return { success: true, message: "Product deleted successfully" }
        } else {
            return { success: false, message: "Action not allowed" }
        }
    } catch {
        return { success: false, message: "Something went wrong!" }
    }
}

const updateProduct = async (id, newProduct, token) => {
    const data = await verifyUser(token)
    if (data.userValid && data.isAdmin) {
        const newP = await Product.findByIdAndUpdate(id, { $set: newProduct })
        return { success: true, message: "Product updated successfully" }
    } else {
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
    } else {
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
    } else {
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
        // Fetch orders
        const orders = await Order.find().sort({ date: -1 }).lean()
        // Fetch user details for each order
        const ordersWithUserDetails = await Promise.all(orders.map(async (order) => {
            const user = await User.findById(order.userId).select('name email').lean()
            return {
                ...order,
                _id: order._id.toString(),
                userId: order.userId.toString(),
                date: order.date.toISOString(),
                expiry_date: order.expiry_date ? order.expiry_date.toISOString() : null,
                user: user ? {
                    _id: user._id.toString(),
                    name: user.name,
                    email: user.email
                } : null
            }
        }))
        return { success: true, orders: ordersWithUserDetails }
    }
    return { success: false, message: "Action not allowed" }

}

function isDateTimeInPast(inputDateTime) {
    var currentDateTime = new Date();
    return inputDateTime < currentDateTime;
}

const fetchOrder = async (id, token) => {
    const data = await verifyUser(token)
    if (data.userValid) {
        await connectToDatabase()
        const order = await Order.findById(id).lean()

        if (!order) {
            return { success: false, message: "Order not found" }
        }

        // Fetch user details
        const user = await User.findById(order.userId).select('name email').lean()

        // Check if order is expired
        if (order.orderStatus == "Accepted" && isDateTimeInPast(order.expiry_date)) {
            if (!order.expired) {
                await Order.findByIdAndUpdate(id, { $set: { orderStatus: "Expired" } })
                order.orderStatus = "Expired"
            }
        }

        // Prepare the response object
        const orderWithUserDetails = {
            ...order,
            _id: order._id.toString(),
            userId: order.userId.toString(),
            date: order.date.toISOString(),
            expiry_date: order.expiry_date ? order.expiry_date.toISOString() : null,
            user: user ? {
                _id: user._id.toString(),
                name: user.name,
                email: user.email
            } : null
        }

        return { success: true, order: orderWithUserDetails }
    }
    return { success: false, message: "Action not allowed" }
}

const updateOrder = async (orderid, token, ip, username, password, currentDate) => {
    const data = await verifyUser(token)
    if (data.userValid) {
        await connectToDatabase()
        const updatedOrder = await Order.findByIdAndUpdate(orderid, {
            $set: {
                ip_address: ip,
                username: username,
                password: password
                // Note: We're not updating the expiry_date or orderStatus here
            }
        }, { new: true })
        if (updatedOrder) {
            return { success: true, message: "Order updated successfully", order: updatedOrder }
        } else {
            return { success: false, message: "Order not found or update failed" }
        }
    }
    return { success: false, message: "Action not allowed" }
}


const rejectOrder = async (orderid, token) => {
    const data = await verifyUser(token)
    if (data.userValid) {
        await connectToDatabase()
        const order = await Order.findByIdAndUpdate(orderid, { $set: { orderStatus: "Rejected" } })
        return { success: true, message: "Order Rejected" }
    }
    return { success: false, message: "Action not allowed" }
}

const cancelOrder = async (orderid, token) => {
    const data = await verifyUser(token)
    if (data.userValid) {
        await connectToDatabase()
        const order = await Order.findByIdAndUpdate(orderid, { $set: { orderStatus: "Cancelled" } })
        return { success: true, message: "Order Cancelled" }
    }
    return { success: false, message: "Action not allowed" }
}

const acceptOrder = async (orderid, token, ip, username, password, currentDate) => {
    const data = await verifyUser(token)
    if (data.userValid) {
        await connectToDatabase()
        currentDate.setDate(currentDate.getDate() + 30)
        const order = await Order.findByIdAndUpdate(orderid, { $set: { ip_address: ip, username: username, password: password, orderStatus: "Accepted", expiry_date: currentDate } })
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
        } else {
            await User.findByIdAndUpdate(userid, { $set: user })
            return { success: true, message: "User details updated successfully" }
        }
    } else {
        return { success: false, message: "Action not allowed" }
    }
}

const getPaymentQR = async () => {
    await connectToDatabase()
    const qr = await Payment.find({})
    console.log(qr)
    if (qr.length == 0) return { success: false }
    else return { success: true, payment: qr[0] }
}
const deleteUser = async (userId, token) => {
    const data = await verifyUser(token)
    if (data.userValid && data.isAdmin) {
        await connectToDatabase()
        try {
            const deletedUser = await User.findByIdAndDelete(userId)
            if (!deletedUser) {
                return { success: false, message: "User not found" }
            }
            return { success: true, message: "User deleted successfully" }
        } catch (error) {
            console.error('Error deleting user:', error)
            return { success: false, message: "Something went wrong" }
        }
    }
    return { success: false, message: "Action not allowed" }
}
export { sendVerificationOTP, verifyOTP, resendOTP, verifyUser, deleteProduct, fetchProduct, getProducts, addToCart, fetchCart, removeFromCart, fetchOrders, fetchAdminOrders, fetchOrder, acceptOrder, updateOrder, fetchUsers, fetchUserOrders, updateUser, cancelOrder, rejectOrder, getPaymentQR, deleteUser }