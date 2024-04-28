"use client"
import { useParams } from 'next/navigation'
import React, { useLayoutEffect, useState } from 'react'
import { fetchProduct } from '../../actions'
import ProductDetail from '../../../components/ProductDetail'
import Navbar from '../../../components/Navbar'

const Page = () => {
    const [product, setProduct] = useState()
    const { id } = useParams()
    useLayoutEffect(() => {
        const getProduct = async () => {
            const product = await fetchProduct(id)
            setProduct(product)
        }
        getProduct()
    }, [])
    return (<>
        <Navbar />
        {product && <ProductDetail product={product} />}
    </>
    )
}

export default Page