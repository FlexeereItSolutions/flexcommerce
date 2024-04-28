"use client"
import { useRouter } from 'next/navigation'
import { useLayoutEffect, useState } from 'react'
import { verifyUser } from "../../actions"

const Page = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    useLayoutEffect(() => {
        const fun = async () => {
            if (localStorage.getItem("token")) {
                const data = await verifyUser(localStorage.getItem("token"))
                if (data.userValid) {
                    //check if user is admin
                    if (data.isAdmin) {
                        router.push("/admin/dashboard/orders")
                    }
                }
            }
        }
        fun()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        // check if email isis valid and email and password are provided
        if (!email || !password) {
            setError("Please provide email and password")
            return
        }
        //check if email is valid 
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please provide a valid email")
            return
        }
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password, isAdmin: true })
            })
            const data = await res.json()
            if (data.success) {
                localStorage.setItem("token", data.token)
                router.push("/admin/dashboard/orders")
                return;
            }
            else {
                setError(data.message)
                return;
            }
        } catch (error) {
            setError("Something went wrong")
        }
    }

    return (
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg">
                <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Admin Login</h1>

                <form onSubmit={handleSubmit} className="mb-0 mt-6 space-y-4 border-gray-300 border-[1px] flex flex-col rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">

                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>

                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("")
                                }}
                                className="w-full rounded-lg border-gray-400 border-[1px] outline-none p-4 py-3 pe-12 text-sm shadow-sm"
                                placeholder="Enter email"
                            />

                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>

                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("")
                                }}
                                className="w-full rounded-lg border-gray-400 border-[1px] outline-none px-4 py-3 pe-12 text-sm shadow-sm"
                                placeholder="Enter password"
                            />
                        </div>
                    </div>
                    <span className='text-red-500'>{error}</span>
                    <button
                        type="submit"
                        className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                    >
                        Login
                    </button>

                </form>
            </div>
        </div>
    )
}

export default Page