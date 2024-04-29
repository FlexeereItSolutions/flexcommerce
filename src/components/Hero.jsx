import React from 'react'

const Hero = () => {
    return (

        <section
            className="relative bg-[url(/bg.jpg)] backdrop-blur-sm bg-cover bg-center bg-no-repeat"
        >
            <div
                className="absolute inset-0"
            ></div>

            <div
                className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-1/2 lg:items-center lg:px-8"
            >
                <div className="max-w-xl text-left">
                    <h1 className="text-3xl text-white font-extrabold sm:text-5xl">
                        Let us find your

                        <strong className="block font-extrabold text-red-400"> Forever Home. </strong>
                    </h1>

                    <p className="mt-4 max-w-lg text-gray-300 sm:text-xl/relaxed">
                        Welcome to our platform, your one-stop solution for VPS services, ecommerce, and cloud machine needs. We provide robust, scalable, and secure virtual private servers.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4 text-center">


                        <a
                            href="/contact"
                            className="block w-full rounded text-white px-12 py-3 text-sm font-medium bg-rose-600 shadow hover:bg-rose-700 focus:outline-none focus:ring active:text-rose-500 sm:w-auto"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero