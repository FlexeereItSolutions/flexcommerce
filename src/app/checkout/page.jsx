"use client"
import { useRouter } from 'next/navigation'
import { fetchCart } from "../actions"
import React, { useLayoutEffect, useState } from 'react'
import { toast } from "react-toastify"
import Navbar from '../../components/Navbar'
import Link from "next/link"
import Image from "next/image"

const Checkout = () => {
    const [ss, setSS] = useState()
    const [transactionNumber, setTransactionNumber] = useState()

    const [cart, setCart] = useState([])
    const [total, setTotal] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    function calculateSubtotal(array) {
        let subtotal = 0;
        for (let i = 0; i < array.length; i++) {
            subtotal += array[i].price;
        }
        return subtotal;
    }
    useLayoutEffect(() => {
        const getCart = async () => {
            if (!localStorage.getItem("token")) return router.push("/login")
            const c = await fetchCart(localStorage.getItem("token"))
            if (c.success) {
                if (c.cart.length < 1) return router.push("/")
                setCart(c.cart)
                const subtotal = calculateSubtotal(c.cart)
                setTotal(subtotal)
            }
            else {
                router.push("/login")
            }
        }
        getCart()
    }, [])


    const handleCheckout = async (e) => {
        e.preventDefault()
        if (!ss) return toast("Payment Screenshot not provided", { type: "error" })
        if (!transactionNumber) return toast("Transaction number not provided", { type: "error" })
        setIsLoading(true)
        // upload the data to place the order
        const formData = new FormData()
        formData.append("token", localStorage.getItem("token"))
        formData.append("transactionNumber", transactionNumber)
        formData.append("ss", ss)
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                toast("Order placed successfully", { type: "success" })
                router.push("/orders")
                return
            }
            else {
                toast(data.message, { type: "error" })
                setIsLoading(false)
                return
            }
        } catch (error) {
            setIsLoading(false)
            toast("Something went wrong", { type: "error" })
        }


    }


    return (<>
        <Navbar />
        <section className="text-gray-600 mt-6 body-font overflow-hidden">
            <h1 className='text-center mt-16 font-bold text-blue-900 underline text-2xl'>Checkout and Payment</h1>
            <div className="container px-5 py-12 mx-auto">
                <div className="lg:w-4/5 mx-auto flex  flex-wrap">
                    <div alt="Pro IP" className="lg:w-1/2 shadow-sm shadow-gray-500 p-6 w-full h-fit  object-cover object-center rounded" >
                        <p className='text-xl font-semibold  underline text-blue-500'>ITEMS</p>
                        <br />
                        <ul className="space-y-4">
                            {cart && cart.length > 0 ? cart.map((item, index) => <> <li key={index} className="flex border-[1px] p-3 rounded-lg shadow-sm hover:scale-[1.02] transition-all hover:shadow-gray-600 items-center gap-4">
                                <Image
                                    src={item.image}
                                    alt=""
                                    height={64}
                                    width={64}
                                    className="size-16 rounded object-cover"
                                />

                                <div>
                                    <Link href={`/product/${item._id}`} className="text-sm hover:underline text-gray-900">{item.name}</Link>

                                    <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                                        <div>
                                            <dt className="inline">Price:</dt>
                                            <dd className="inline">₹{item.price}</dd>
                                        </div>

                                    </dl>
                                </div>

                                <div className="flex flex-1 items-center justify-end gap-2">


                                </div>
                            </li></>) : <></>}


                        </ul>
                    </div>
                    <div className="lg:w-1/2 w-full lg:pl-10  lg:mt-0">
                        <h1 className="text-gray-900 text-xl mb-2 title-font font-medium">Payment QR Code</h1>
                        <div className="flex mb-4">
                            <Image src={"/bg.jpg"} width={1500} height={1500} className='  max-w-full h-auto object-cover object-center rounded' />
                        </div>
                        <form onSubmit={handleCheckout}>
                            <div className='flex flex-col'>
                                <label htmlFor="ss" className='text-black mb-2'>Payment Screenshot</label>
                                <div className={`${ss ? "" : "border-dashed border-2 border-gray-200"} rounded-lg flex flex-col items-center justify-center  ${ss ? "h-fit" : "h-[100px]"} dark:border-gray-800 relative`}>
                                    {ss ? <><img src={URL.createObjectURL(ss)} alt="" className="w-full h-full object-cover object-center rounded" /></> :
                                        <><input className="absolute inset-0 opacity-0 cursor-pointer" type="file" onChange={e => setSS(e.target.files[0])} />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" className="w-8 h-8">
                                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2">
                                                </rect>
                                                <circle cx="9" cy="9" r="2">
                                                </circle>
                                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21">
                                                </path>
                                            </svg>
                                            <div className="text-sm text-gray-500 text-center ml-2 dark:text-gray-400">
                                                Click to upload or drag and drop an image
                                            </div></>}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                {/* <label htmlFor="tno" className='text-black my-2'>Transaction Number</label> */}
                                <input type="text" className='my-4 border-[1px] border-black px-4 text-black py-2 rounded-lg bg-gray-100 outline-none' name='tno' value={transactionNumber} onChange={e => setTransactionNumber(e.target.value)} placeholder='Enter Transaction number' />
                            </div>
                            <div className="flex justify-between">
                                {total > 0 && <div className="items-center flex justify-between w-full pt-2">
                                    <div className=" max-w-lg ">
                                        <dl className="space-y-0.5 text-sm text-gray-700">
                                            <div className="flex justify-end items-center space-x-2 text-xl font-medium">
                                                <dt>Total: {" "}</dt>
                                                <dd className="font-bold text-black">₹{total}</dd>
                                            </div>
                                        </dl>

                                        <div className="flex justify-end">

                                        </div>

                                    </div>
                                    <button type='submit' disabled={isLoading} className="disabled:bg-indigo-400 whitespace-nowrap text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Place Order</button>
                                </div>}

                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </section>
    </>
    )
}

export default Checkout