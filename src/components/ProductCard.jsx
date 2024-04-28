"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { addToCart, deleteProduct, } from '../app/actions'
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify"

const ProductCard = ({ id, title, price, image, isAdmin = false }) => {
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

    const handleDelete = async (id) => {
        if (isAdmin) {
            const res = confirm("Do you really want to delete it?")
            if (res) {
                const data = await deleteProduct(id, localStorage.getItem("token"))
                if (data.success) {
                    toast(data.message, { type: "success" })
                }
                else {
                    toast(data.message, { type: "error" })
                }
            }
        }
        else {
            toast("You are not authorized to delete this product", { type: "error" })
        }
    }

    return (
        <div className="rounded-xl shadow-md shadow-gray-300 m-4 group border-rose-200 border-[0.1px] relative block overflow-hidden md:max-w-[31%]">

            <Image
                src={image}
                alt=""
                width={256}
                height={256}
                className="h-64 object-cover transition duration-500 group-hover:scale-105 sm:h-72"
            />

            <div className="relative border border-gray-100 bg-white p-6">
                {/* <span className="whitespace-nowrap bg-rose-500 text-white rounded-full px-3 py-1.5 text-xs font-medium"> New </span> */}

                <Link href={`/product/${id}`} className="mt-4 hover:underline text-lg font-medium text-gray-900">{title}</Link>

                <p className="mt-1.5 text-sm text-gray-700">₹{price}</p>

                <div className="mt-4">
                    {isAdmin ? <>
                        <button
                            onClick={() => router.push(`/admin/dashboard/products/edit/${id}`)}
                            className="block text-center w-full rounded bg-green-500 p-4 text-white text-sm font-medium transition hover:scale-105"
                        >
                            Edit Product
                        </button>
                        <button
                            onClick={() => handleDelete(id)}
                            className="block mt-2 text-center w-full rounded bg-rose-500 p-4 text-white text-sm font-medium transition hover:scale-105"
                        >
                            Delete Product
                        </button>
                    </> : <>
                        <button
                            onClick={() => addtoCart(id)}
                            className="block text-center w-full rounded bg-rose-500 p-4 text-white text-sm font-medium transition hover:scale-105"
                        >
                            Add to Cart
                        </button>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default ProductCard