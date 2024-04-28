
import { v2 as cloudinary } from 'cloudinary';
import Product from '../../../../models/Product';
import { NextResponse } from 'next/server';
import { verifyUser } from '../../../actions';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const PUT = async (req) => {
    const formdata = await req.formData()
    const token = formdata.get('token')
    const data = await verifyUser(token)
    // write code to verify the token, check whther the user is admin or not, if not admin, send proper response

    if (!data.userValid || !data.isAdmin) {
        return NextResponse.json({ success: false, message: "Action not allowed" })
    }
    const id = formdata.get('id')
    const isImgChanged = formdata.get("isImgChanged")
    const name = formdata.get('name')
    const price = formdata.get('price')
    const description = formdata.get('description')
    console.log(name, price, description)
    let uploadedImage = formdata.get('image')
    try {
        console.log("reached here")
        // console.log(isImgChanged.toString(2))
        //convert the imsge to base64
        console.log(JSON.parse(isImgChanged))
        if (JSON.parse(isImgChanged)) {
            console.log("inside if statement", isImgChanged)
            const file = await uploadedImage.arrayBuffer()
            const base64 = Buffer.from(file).toString('base64')
            // upload to cloudinary with the mimetype ad from the file
            const d = await cloudinary.uploader.upload(`data:${uploadedImage.type};base64,${base64}`)
            uploadedImage = d.secure_url
        }
        console.log(uploadedImage)
        // code to connect to database and save the data in product
        const newP = await Product.findByIdAndUpdate(id, { $set: { name, price, description, image: uploadedImage } })
        return NextResponse.json({ success: true, message: "Product updated successfully" })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong", error })
    }
}