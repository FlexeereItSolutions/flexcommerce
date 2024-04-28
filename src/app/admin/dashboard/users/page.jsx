"use client"
import { fetchUsers } from '@/app/actions'
import { useRouter } from 'next/navigation'
import React, { useLayoutEffect, useState } from 'react'
import Link from "next/link"
import EditUserModal from '@/components/EditUserModal'

const Page = () => {
    const [users, setUsers] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const [selectedUsers, setSelectedUsers] = useState()
    useLayoutEffect(() => {
        const getUsers = async () => {
            if (!localStorage.getItem("token")) return router.push("/admin/login")
            const data = await fetchUsers(localStorage.getItem("token"))
            if (data.success) {
                setUsers(data.users)
            }
            else {
                router.push("/admin/login")
            }
        }
        getUsers()
    }, [])
    return (
        <div className="rounded-lg border border-gray-200">
            {selectedUsers && <EditUserModal onHide={() => { setIsOpen(false); setSelectedUsers() }} show={isOpen} user={selectedUsers} />}
            <h1 className='text-center mt-4 text-2xl font-bold underline mb-4'>User List</h1>
            <div className="overflow-x-auto rounded-t-lg">
                {users && users.length > 0 && <>
                    <table className="max-md:hidden max-sm:min-w-full w-[60%] mx-auto divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="text-left ">
                            <tr>
                                <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">Name</th>
                                <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">Email</th>
                                <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">Status</th>
                                <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">Role</th>
                                <th className="whitespace-nowrap px-2 py-2 font-medium hidden text-gray-900">Edit</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {users.map((user, index) => <tr key={index}>
                                <td className="whitespace-nowrap px-2 py-2 font-medium text-gray-700"><Link href={`/admin/dashboard/users/${user._id}`}>{user.name}</Link></td>
                                <td className="whitespace-nowrap px-2 py-2 text-gray-700"><Link href={`/admin/dashboard/users/${user._id}`}>{user.email}</Link></td>
                                <td className="whitespace-nowrap py-1  text-white">{user.isActive ? <span className='bg-green-600 px-2 py-1 rounded-full'>Verified</span> : <span className='bg-red-400 px-3 py-1 rounded-full'>Unverified</span>}</td>
                                <td className="whitespace-nowrap py-1  text-white">{user.isAdmin ? <span className='bg-green-600 px-4 py-1 rounded-full'>Admin</span> : <span className='bg-blue-600 px-6 py-1 rounded-full'>User</span>}</td>
                                <td className="whitespace-nowrap py-1  text-black "><button onClick={() => { setSelectedUsers(user); setIsOpen(true) }} className='bg-red-600 text-white px-3 py-1 rounded-sm'> Edit</button></td>
                            </tr>)}
                        </tbody>
                    </table>

                    <table className="md:hidden max-sm:min-w-full w-[60%] mx-auto divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="text-left ">
                            <tr>
                                <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">User</th>
                                <th className="whitespace-nowrap px-2 py-2 font-medium text-gray-900">Role</th>
                                <th className="whitespace-nowrap px-2 py-2 font-medium hidden text-gray-900">Edit</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {users.map((user, index) => <tr key={index}>
                                <td className="whitespace-nowrap px-2 py-2 font-medium text-gray-700"><Link className='text-sm' href={`/admin/dashboard/users/${user._id}`}>{user.name} {user.isActive ? <span className='bg-green-600 px-2 text-[10px] rounded-full text-white font-light'>Verified</span> : <span className='bg-red-400 px-1 text-[10px] rounded-full text-white font-light'>Unverified</span>}<br /><span className='text-xs'> {user.email}</span></Link></td>
                                {/* <td className="whitespace-nowrap px-2 py-2 text-gray-700"><Link href={`/admin/dashboard/users/${user._id}`}></Link></td> */}
                                <td className="whitespace-nowrap py-1  text-white">{user.isAdmin ? <span className='bg-green-600 px-4 py-1 rounded-full'>Admin</span> : <span className='bg-blue-600 px-6 py-1 rounded-full'>User</span>}</td>
                                <br />
                                <td className="whitespace-nowrap py-1  text-black "><button onClick={() => { setSelectedUsers(user); setIsOpen(true) }} className='bg-red-600 text-white px-3 py-1 rounded-sm'> Edit</button></td>
                            </tr>)}
                        </tbody>
                    </table>


                </>}
            </div>

        </div>
    )
}

export default Page