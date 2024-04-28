"use client"
import { useRouter } from 'next/navigation'
import React, { useLayoutEffect } from 'react'
import { verifyUser } from '../actions'

const Page = () => {
    const router = useRouter()
    useLayoutEffect(() => {
        const verify = async () => {
            if (!localStorage.getItem("token")) return router.push("/admin/login")
            const data = await verifyUser(localStorage.getItem("token"))
            if (data.userValid && data.isAdmin) return router.push("/admin/dashboard/orders")
            return router.push("/admin/login")
        }
        verify()
    })
    return (
        <></>
    )
}

export default Page