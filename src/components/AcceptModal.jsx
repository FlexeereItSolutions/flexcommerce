
import Modal from 'react-modal';
import { useState } from 'react';
import { acceptOrder } from '../app/actions';
import { useRouter } from 'next/navigation';

function AcceptModal({ show, onHide, orderid }) {
    const [ip, setIp] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!ip || !username || !password) return setError("All fields are mandatory")
        const data = await acceptOrder(orderid, localStorage.getItem("token"), ip, username, password, new Date())
        if (data.success) {
            router.refresh()
            setIp("")
            setUsername("")
            setError("")
            setPassword("")
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
                    backgroundColor: "transparent",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    inset: 'auto'
                }
            }}
            ariaHideApp={false}
            contentLabel="Example Modal"
        >
            <div className="justify-center items-center p-4 max-w-[100vw] bg-zinc-300 flex flex-col px-16 py-12 rounded-xl max-md:px-5">
                <div className="text-black text-center text-2xl font-medium whitespace-nowrap mt-3.5">
                    Accept Order{" "}
                </div>
                <form className="flex flex-col max-md:max-w-[90%]" onSubmit={handleSubmit}>
                    <input type="text" name="ip" value={ip} onChange={e => { setIp(e.target.value); setError("") }} placeholder="Enter IP" className="text-black text-xl whitespace-nowrap border self-stretch justify-center mt-10 px-5 py-4 rounded-xl border-solid border-neutral-500 items-start max-md:pr-5" />

                    <input type="text" name="username" placeholder="Username" value={username} onChange={e => { setUsername(e.target.value); setError("") }} className="text-black text-xl whitespace-nowrap border self-stretch justify-center mt-4 px-5 py-4 rounded-xl border-solid border-neutral-500 items-start max-md:pr-5" />

                    <input type="password" name="password" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setError("") }} className="text-black text-xl whitespace-nowrap border self-stretch justify-center mt-4 px-5 py-4 rounded-xl border-solid border-neutral-500 items-start max-md:pr-5" />

                    <span className="text-red-500 mt-3">{error}</span>

                    <button type="submit" className="text-white bg-green-500 text-xl whitespace-nowrap items-stretch shadow-sm  justify-center mt-7 mb-3.5 px-10 py-3 rounded-[40px] max-md:px-5">
                        Accept Order
                    </button>
                </form>
            </div>
        </Modal>
    );
}

export default AcceptModal;