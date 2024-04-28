"use client"
import React, { useLayoutEffect, useState } from 'react'
import ProductCard from '../../../../components/ProductCard'
import { getProducts } from '../../../actions'

const Page = () => {
    const [products, setProducts] = useState(null)
    useLayoutEffect(() => {
        const fetchProduct = async () => {
            const products = await getProducts()
            setProducts(products)
        }
        fetchProduct()
    }, [])
    return (
        <div>
            <h1 className='text-center font-bold text-4xl p-5'>Products</h1>
            <div className='flex max-md:space-y-4 md:space-x-4 md:max-w-[80%] justify-center flex-wrap items-center mx-auto'>
                {products && products.map((product, index) => <ProductCard id={product._id.toString()} title={product.name} image={product.image} price={product.price} key={index} isAdmin={true} />)}
            </div>
        </div>
    )
}

export default Page