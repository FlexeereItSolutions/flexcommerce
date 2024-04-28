
import Modal from 'react-modal';
import Image from "next/image"
import { X } from "lucide-react"

function ImageModal({ show, onHide, img }) {
    return (
        <Modal
            isOpen={show}
            onRequestClose={onHide}
            style={{
                overlay: {
                    zIndex: 50,
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
            <button className='absolute top-0 right-0 m-4 z-20 bg-white rounded-full p-2' onClick={onHide}><X /></button>
            <div className="justify-center items-center bg-zinc-800 flex flex-col px-16 py-12  w-max h-max rounded-xl max-md:px-5">
                <Image src={img} layout='fill' className='max-w-screen  h-screen object-contain' />
            </div>
        </Modal>
    );
}

export default ImageModal;