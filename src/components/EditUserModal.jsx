
import Modal from 'react-modal';
import { useState } from 'react';
import { updateUser } from '../app/actions';
import { useRouter } from 'next/navigation';

function EditUserModal({ show, onHide, user }) {
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [status, setStatus] = useState(user.isActive)
    const [role, setRole] = useState(user.isAdmin)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !email) return setError("All fields are mandatory")
        const data = await updateUser({ name: name.trim(), email: email.trim(), isAdmin: role, isActive: status }, localStorage.getItem("token"), user._id)

        if (data.success) {
            router.refresh()
            setName("")
            setEmail("")
            setError("")
            setStatus("")
            setRole("")
            window.location.reload()
            onHide()
        }
        else {
            setError(data.message)
        }
    }
    return (
        <Modal
            isOpen={show}
            onRequestClose={onHide}
            style={{
                overlay: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
                },
                content: {
                    position: 'static',
                    width: 'max-content',
                    height: 'max-content',
                    minWidth: "50%",
                    backgroundColor: "transparent",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    inset: 'auto'
                }
            }}
            ariaHideApp={false}
            contentLabel="Edit User Modal"
        >
            <div className="justify-center items-center md:w-[55%] p-4 max-sm:max-w-[95vw] bg-zinc-300 flex flex-col px-4 py-6 rounded-xl max-md:px-5">
                <div className="text-black text-center text-2xl font-medium whitespace-nowrap mt-3.5">
                    Edit User{" "}
                </div>
                <form className="flex flex-col max-md:max-w-[90%] w-[90%]" onSubmit={handleSubmit}>
                    <input type="text" name="name" value={name} onChange={e => { setName(e.target.value); setError("") }} placeholder="Name" className="text-black  whitespace-nowrap border self-stretch justify-center mt-4 px-5 py-2 rounded-xl border-solid border-neutral-500 items-start max-md:pr-5" />

                    <input type="email" name="email" placeholder="Email" value={email} onChange={e => { setEmail(e.target.value); setError("") }} className="text-black  whitespace-nowrap border self-stretch justify-center mt-4 px-5 py-2 rounded-xl border-solid border-neutral-500 items-start max-md:pr-5" />
                    <fieldset className="grid grid-cols-2 gap-4 mt-4">
                        <legend className='font-medium'>Account Status</legend>

                        <div>
                            <label
                                htmlFor="verified"
                                className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                                onClick={() => setStatus(true)}
                            >
                                <div>
                                    <p className="text-gray-700">Verified</p>
                                </div>

                                <input
                                    type="radio"
                                    name="verified"
                                    value="verified"
                                    id="status"
                                    className="size-5 border-gray-300 text-blue-500"
                                    checked={status == true}

                                />
                            </label>
                        </div>

                        <div>
                            <label
                                htmlFor="unverified"
                                className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                                onClick={() => setStatus(false)}
                            >
                                <div>
                                    <p className="text-gray-700">Unverfied</p>
                                </div>

                                <input
                                    type="radio"
                                    name="unverified"
                                    value="unverified"
                                    id="status"
                                    className="size-5 border-gray-300 text-blue-500"
                                    checked={status == false}
                                />
                            </label>
                        </div>
                    </fieldset>
                    <fieldset className="grid grid-cols-2 gap-4 mt-4">
                        <legend className='font-medium'>Role</legend>

                        <div>
                            <label
                                htmlFor="admin"
                                className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                                onClick={() => setRole(true)}
                            >
                                <div>
                                    <p className="text-gray-700">Admin</p>
                                </div>

                                <input
                                    type="radio"
                                    name="admin"
                                    value="admin"
                                    id="role"
                                    className="size-5 border-gray-300 text-blue-500"
                                    checked={role == true}

                                />
                            </label>
                        </div>

                        <div>
                            <label
                                htmlFor="user"
                                className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                                onClick={() => setRole(false)}
                            >
                                <div>
                                    <p className="text-gray-700">User</p>
                                </div>

                                <input
                                    type="radio"
                                    name="user"
                                    value="user"
                                    id="role"
                                    className="size-5 border-gray-300 text-blue-500"
                                    checked={role == false}
                                />
                            </label>
                        </div>
                    </fieldset>

                    <span className="text-red-500 mt-3">{error}</span>

                    <button type="submit" className="text-white bg-green-500  whitespace-nowrap items-stretch shadow-sm  justify-center mt-7 mb-3.5 px-10 py-3 rounded-[40px] max-md:px-5">
                        Save Changes
                    </button>
                </form>
            </div>
        </Modal>
    );
}

export default EditUserModal;