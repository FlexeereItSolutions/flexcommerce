"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { useLayoutEffect } from 'react'
import { verifyUser } from "../app/actions"
import Link from 'next/link'
import { MyHeader } from './component/my-header'
import { LogOut } from "lucide-react"

const AdminHeader = () => {
    const router = useRouter()

    useLayoutEffect(() => {
        const fun = async () => {
            if (localStorage.getItem("token")) {
                const data = await verifyUser(localStorage.getItem("token"))
                if (data.userValid) {
                    //check if user is admin
                    if (!data.isAdmin) {
                        router.push("/admin/login")
                    }
                }
                else {
                    router.push("/admin/login")
                }
            }
            else {
                router.push("/admin/login")
            }
        }
        fun()
    }, [])
    return (
        <div>
            <div className="sm:hidden flex gap-4 px-4 items-center justify-center">
                <MyHeader />
                <LogOut onClick={() => {
                    localStorage.removeItem("token")
                    router.push("/admin/login")
                }} className='bg-white p-2 size-10 border-[1px] border-gray-300 cursor-pointer rounded-md ' />
            </div>

            <div className="hidden py-2 border-b-[1px] border-gray-300 sm:flex justify-center">
                <nav className="flex gap-6" aria-label="Tabs">
                    <Link
                        href="/admin/dashboard/orders"
                        className="shrink-0 px-4 border-[1px]  hover:bg-blue-400 rounded-lg py-2 text-sm font-medium text-black hover:text-white"
                    >
                        Orders
                    </Link>

                    <Link
                        href="/admin/dashboard/products"
                        className="shrink-0 rounded-lg px-4 border-[1px]  hover:bg-blue-400  p-2 text-sm font-medium text-black  hover:text-white"
                    >
                        Manage Products
                    </Link>

                    <Link
                        href="/admin/dashboard/add-product"
                        className="shrink-0 rounded-lg px-4 border-[1px] hover:bg-blue-400 hover:text-white p-2 text-sm font-medium text-black "
                    >
                        Add Product
                    </Link>
                    <Link
                        href="/admin/dashboard/users"
                        className="shrink-0 rounded-lg px-4 border-[1px] hover:bg-blue-400 hover:text-white p-2 text-sm font-medium text-black "
                    >
                        Users
                    </Link>
                    <LogOut onClick={() => {
                        localStorage.removeItem("token")
                        router.push("/admin/login")
                    }} className='bg-white p-2 size-9 border-[1px] border-gray-300 cursor-pointer rounded-md ' />
                </nav>
            </div>
        </div>
    )
}

export default AdminHeader