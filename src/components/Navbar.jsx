"use client"
import { verifyUser } from "../app/actions"
import Link from "next/link"
import { useLayoutEffect, useState } from "react"
import { ShoppingCart, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

const Navbar = () => {
    const [isValid, setIsValid] = useState(false)
    const router = useRouter()
    useLayoutEffect(() => {
        const checkUser = async () => {
            if (localStorage.getItem("token")) {
                const data = await verifyUser(localStorage.getItem("token"))
                if (data.userValid) setIsValid(true)
            }
        }
        checkUser()
    }, [])
    return (
        <header className="bg-white border-gray-300 border-b-[1px] bg-opacity-50 absolute top-0 left-0 z-10 w-full">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex-1 md:flex md:items-center md:gap-12">
                        <Link className="block text-teal-600" href="/">
                            <span className="sr-only">Home</span>
                            <img className="h-8" src="/logo.png" alt="Home" />
                        </Link>
                    </div>

                    <div className="md:flex md:items-center md:gap-12">

                        <div className="flex items-center gap-4">
                            {isValid ? <div className="flex gap-2">
                                <Link
                                    className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                                    href="/cart"
                                >
                                    <ShoppingCart />
                                </Link>
                                <Link
                                    href={"/orders"}
                                    className="rounded-md bg-gray-100 px-5 py-2.5 flex items-center justify-center text-sm font-medium text-teal-600"

                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsValid(false);
                                        localStorage.removeItem("token")
                                        router.push("/")
                                    }}
                                    className="rounded-md bg-gray-100 px-3  text-sm font-medium text-teal-600"

                                >
                                    <LogOut />
                                </button>


                            </div>
                                : <div className="flex sm:gap-4">
                                    <Link
                                        className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                                        href="/login"
                                    >
                                        Login
                                    </Link>

                                    <div className="ml-2 flex">
                                        <Link

                                            className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600"
                                            href="/register"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                </div>}


                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar