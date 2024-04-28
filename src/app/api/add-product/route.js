
import { v2 as cloudinary } from 'cloudinary';
import Product from '../../../models/Product';
import { checkHash } from "../../../lib/utils"
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const POST = async (req) => {
    const formdata = await req.formData()
    const token = formdata.get('token')

    // write code to verify the token, check whther the user is admin or not, if not admin, send proper response
    const isValid = jwt.verify(token, process.env.JWT_SECRET)
    if (!isValid) {
        return NextResponse.json({ success: false, message: "Action not allowed" })
    }

    const name = formdata.get('name')
    const price = formdata.get('price')
    const description = formdata.get('description')
    console.log(name, price, description)
    const image = formdata.get('image')
    try {
        //convert the imsge to base64
        const file = await image.arrayBuffer()
        const base64 = Buffer.from(file).toString('base64')

        // upload to cloudinary with the mimetype ad from the file
        const uploadedImage = await cloudinary.uploader.upload(`data:${image.type};base64,${base64}`)

        // code to connect to database and save the data in product
        const product = new Product({
            name,
            price,
            description,
            image: uploadedImage.secure_url
        })
        await product.save()
        return NextResponse.json({ success: true, message: "Product added successfully" })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" })
    }
}