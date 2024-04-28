"use client"
import React, { useLayoutEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { getProducts } from '../app/actions'

const Products = () => {
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
            <h1 className='text-center font-bold text-4xl p-5'>Our Services</h1>
            <div className='flex max-md:space-y-4 md:space-x-4 md:max-w-[80%] justify-center flex-wrap items-center mx-auto'>
                {products && products.map((product, index) => <ProductCard id={product._id.toString()} title={product.name} image={product.image} price={product.price} key={index} />)}
            </div>
        </div>
    )
}

export default Products