"use client"
import { useRouter } from 'next/navigation'
import { getPaymentQR } from '../../../actions'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

const Page = () => {

    const [image, setImage] = useState("")
    const [isImgChange, setIsImgChange] = useState(false)
    const [error, setError] = useState('')
    const inputRef = useRef()
    const router = useRouter()
    useLayoutEffect(() => {
        const getProduct = async () => {
            const data = await getPaymentQR()
            if (data.success && data.payment) setImage(data.payment.payment_qr)
        }
        getProduct()
    }, [])

    const handleClick = async () => {
        if (!localStorage.getItem("token")) return router.push("/admin/login");
        if (isImgChange) {
            const formData = new FormData();
            formData.append('qr_image', image);
            formData.append("token", localStorage.getItem("token"));
            console.log('Form Data:', formData); // Log the form data for debugging
    
            const res = await fetch("/api/change-qr", {
                body: formData,
                method: "POST"
            });
            const data = await res.json();
            if (data.success) {
                toast(data.message, { type: 'success' });
            } else {
                toast(data.message, { type: 'error' });
                console.error('Error uploading QR code:', data.error); // Log the error message
            }
        }
    };
    return (
        <div className='rounded-lg border max-md:w-[90%] md:w-[60%] my-4 mx-auto bg-card text-card-foreground shadow-sm'>
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">Manage QR Code</h3>
                <p className="text-sm text-muted-foreground">Fill in the details below</p>
            </div>
            <div className={`${image ? "" : "border-dashed border-2 border-gray-200"} rounded-lg flex flex-col items-center justify-center  h-[200px] dark:border-gray-800 relative`}>
                {image ? <img alt={"Payment QR"} src={isImgChange ? URL.createObjectURL(image) : image} layout='fill' className='object-contain h-[200px]' /> : <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
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
            <div
                onClick={() => { inputRef.current.click(); }}
                className="mt-4 inline-flex cursor-pointer bg-green-500 text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 ml-auto">
                <input ref={inputRef} className="hidden inset-0 opacity-0 cursor-pointer" type="file" onChange={e => { setImage(e.target.files[0]); setIsImgChange(true) }} />
                Change Image
            </div>
            <br />
            <button
                onClick={handleClick}
                className="mt-4 inline-flex cursor-pointer bg-red-500 text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mx-4 ml-auto">

                Upload
            </button>
        </div>
    )
}

export default Page