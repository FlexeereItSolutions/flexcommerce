//mongodb model of product. first the check the model already exits, then only create. use new es6 syntax
import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});
//check if the model already exists
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;