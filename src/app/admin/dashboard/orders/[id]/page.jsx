"use client"
import { useParams, useRouter } from 'next/navigation'
import { fetchOrder } from '../../../../actions'
import { useLayoutEffect, useState } from 'react'
import { toast } from "react-toastify"
import ImageModal from '../../../../../components/ImageModal'
import AcceptModal from '../../../../../components/AcceptModal'
import { Copy } from "lucide-react"

const AdminOrderDetail = () => {
    const { id } = useParams()
    const [order, setOrder] = useState()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [accept, setAccept] = useState(false)
    useLayoutEffect(() => {
        const getOrder = async () => {
            if (!localStorage.getItem("token")) return router.push("/admin/login")
            const data = await fetchOrder(id, localStorage.getItem("token"))
            if (data.success) {
                setOrder(data.order)
                return
            }
            else {
                return router.push(`/admin/login`)
            }
        }
        getOrder()
    }, [isOpen])
    return (
        <section className="text-gray-600 mt-6 body-font overflow-hidden">
            {order && <><ImageModal show={isOpen} onHide={() => setIsOpen(false)} img={order.payment_ss} />
                <AcceptModal onHide={() => setAccept(false)} show={accept} orderid={order._id} />
            </>}
            <div className="container px-5 py-4 mx-auto">
                {order && <div className="lg:w-4/5 mx-auto items-start flex flex-wrap">
                    <img alt={order.item.name} src={order.item.image} width={1500} height={1500} className='lg:w-1/2 w-full lg:h-auto h-64  object-center object-contain rounded' />

                    <div className="lg:w-1/2 w-full lg:pl-10 mt-6 lg:mt-0">
                        <h1 className="text-gray-500 text-sm title-font font-medium mb-1">OrderID: {order._id}</h1>

                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{order.item.name} </h1>
                        <div className={`${order.orderStatus == "Accepted" ? "text-white bg-green-400 px-3 py-1 rounded-full" : "text-white bg-red-400 px-3 py-1 rounded-full"} w-fit text-sm text-gray-600 transition`}>
                            {order.orderStatus}
                        </div>
                        <p className="leading-relaxed border-b border-gray-300 pb-2">{order.item.description.split("\n").map((v, i) => <p key={i}>{v}</p>)}</p>

                        <p className="title-font font-medium text-sm mt-2 text-gray-900">Transaction No: {order.transactionNumber}</p>
                        <p className="title-font font-medium text-2xl text-gray-900">Price: ₹{order.subtotal}</p>
                        <button onClick={() => setIsOpen(true)} className="flex text-white bg-indigo-500 border-0 py-1 px-3 focus:outline-none hover:bg-indigo-600 rounded">View Payment Screenshot</button>
                        {order.orderStatus != "Accepted" ? <div className="flex gap-2">
                            <button onClick={() => setAccept(true)} className="flex text-white mt-4 bg-green-500 border-0 py-1 px-2 focus:outline-none  rounded">Accept Order</button>
                            {/* <button className="flex text-white mt-4 bg-red-500 border-0 py-1 px-2 focus:outline-none rounded">Reject Order</button> */}
                        </div> : <>
                            <p className='text-black text-xl font-bold'>Credentials</p>
                            <p className='text-black'>IP Address</p>
                            <div className="flex bg-black w-fit p-2 rounded-md">
                                <input type="text" readOnly={true} className='bg-black outline-none text-gray-200' value={order.ip_address} />
                                <Copy className='cursor-pointer text-white' onClick={() => navigator.clipboard.writeText(order.ip_address)} />
                            </div>
                            <p className='text-black'>Username</p>
                            <div className="flex bg-black w-fit p-2 rounded-md">
                                <input type="text" readOnly={true} className='bg-black outline-none text-gray-200' value={order.username} />
                                <Copy className='cursor-pointer text-white' onClick={() => navigator.clipboard.writeText(order.username)} />
                            </div>
                            <p className='text-black'>Password</p>
                            <div className="flex bg-black w-fit p-2 rounded-md">
                                <input type="password" readOnly={true} className='bg-black outline-none text-gray-200' value={order.password} />
                                <Copy className='cursor-pointer text-white' onClick={() => navigator.clipboard.writeText(order.password)} />
                            </div>
                        </>}
                    </div>
                </div>}
            </div>
        </section>
    )
}

export default AdminOrderDetail