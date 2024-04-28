"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from "react-toastify"

const Page = () => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !price || !description || !image) {
      setError("Please fill all fields")
      return
    }
    console.log(name, price, description, image)
    const formData = new FormData()
    formData.append("token", localStorage.getItem("token"))
    formData.append("name", name)
    formData.append("price", price)
    formData.append("description", description)
    formData.append("image", image)
    try {
      const res = await fetch("/api/add-product", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        toast("Product added successfully", { type: "success" })
        router.push("/admin/dashboard/products")
        return
      }
      else {
        setError(data.message)
        return
      }
    } catch (error) {
      toast("Something went wrong", { type: "error" })
    }
  }
  return (
    <form onSubmit={handleSubmit} className="rounded-lg border max-md:w-[90%] md:w-[60%] my-4 shadow-black mx-auto bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">Add Product</h3>
        <p className="text-sm text-muted-foreground">Fill in the details below</p>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-1">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm" for="name">
              Name
            </label>
            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="name" placeholder="Enter product name" required="" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm" for="price">
              Price
            </label>
            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="price" placeholder="Enter product price" required="" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm" for="description">
              Description
            </label>
            <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="description" placeholder="Enter product description" required="" data-gramm="false" wt-ignore-input="true" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

        </div>
        <div className={`${image ? "" : "border-dashed border-2 border-gray-200"} rounded-lg flex flex-col items-center justify-center  h-[200px] dark:border-gray-800 relative`}>
          {image ? <Image src={URL.createObjectURL(image)} layout='fill' className='object-contain ' /> : <><input className="absolute inset-0 opacity-0 cursor-pointer" type="file" value={image} onChange={e => setImage(e.target.files[0])} />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" className="w-8 h-8">
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
      </div>
      <span className='text-red-500 mx-auto ml-6 text-center'>{error}</span>
      <div className="flex items-center p-6">
        <button type='submit' className="inline-flex bg-blue-500 text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ml-auto">Save</button>
      </div>
    </form>
  )
}

export default Page