import React from 'react';
 // Make sure to have a Telegram logo image in your project

const Footer = () => {
    return (
        <footer className="bg-gray-50">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center sm:flex-row sm:justify-between">
                    <span className="flex items-center">
                        <img src="/logo.png" alt="Pro IP" className="h-6 mr-2" />
                        Pro IP
                    </span>
                    <div className="flex mt-4 sm:mt-0">
                    <a href='/contact' className='text-lg font-bold'>Contact Us</a>
                        <a href="https://t.ly/68VkF" target="_blank" rel="noopener noreferrer" className="mr-4">
                            <img src="/whatsapp-logo.png" alt="WhatsApp" className="h-6" />
                        </a>
                        <a href="https://t.me/+0TD8yBfFQVExZmFl" target="_blank" rel="noopener noreferrer">
                            <img src="/telegram-logo.png" alt="Telegram" className="h-6" />
                        </a>
                    </div>
                    <p className="mt-4 text-center text-sm text-gray-500 lg:text-right">
                        Copyright © 2024. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
