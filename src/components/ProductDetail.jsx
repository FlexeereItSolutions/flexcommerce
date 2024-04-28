import { useRouter } from 'next/navigation'
import { addToCart } from '../app/actions'
import React from 'react'
import { toast } from "react-toastify"

const ProductDetail = ({ product }) => {
    const router = useRouter()
    const addtoCart = async (product_id) => {
        if (!localStorage.getItem("token")) return router.push("/login")
        const data = await addToCart(product_id, localStorage.getItem('token'))
        if (data.success) {
            toast(data.message, { type: "success" })
        }
        else {
            toast(data.message, { type: "error" })
        }
    }
    return (
        <section className="text-gray-600 mt-6 body-font overflow-hidden">
            <div className="container px-5 py-24 mx-auto">
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={product.image} />
                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.name}</h1>
                        <div className="flex mb-4">

                        </div>
                        <p className="leading-relaxed">{product.description.split("\n").map((v, i) => <p key={i}>{v}</p>)}</p>
                        <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">

                        </div>
                        <div className="flex">
                            <span className="title-font font-medium text-2xl text-gray-900">₹{product.price}</span>
                            <button onClick={() => addtoCart(product._id)} className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Add to Cart</button>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductDetail