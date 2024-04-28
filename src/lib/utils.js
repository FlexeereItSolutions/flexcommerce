import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'

async function createHash(value) {
    const salt = await bcrypt.genSalt(10);
    const hashedValue = await bcrypt.hash(value, salt);
    return hashedValue;
}

async function checkHash(value, hashedValue) {
    const isValid = await bcrypt.compare(value, hashedValue);
    return isValid;
}

const sendOTP = async (to, otp) => {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    await transport.sendMail({
        from: `<${process.env.MAIL_USERNAME}>`,
        to: to,
        subject: "Email verification",
        html: `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <div style="background-color: #f4f4f4; padding: 10px;">
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="background-color: #fff; padding: 20px; text-align: center; border-radius: 15px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #444; font-size: 24px;"></h2>
                    <p style="font-size: 16px; color: #666;">
                        We're excited to have you on board. To complete your registration, please verify your email address by entering the following OTP:
                    </p>
                    <div style="font-size: 24px; color: #444; padding: 20px; border-radius: 5px; background-color: #f9f9f9; display: inline-block;">
                        ${otp}
                    </div>
                    <p style="font-size: 16px; color: #666;">
                        If you did not request this code, you can safely ignore this email.
                    </p>
                    <p style="font-size: 16px; color: #666;">
                        Thanks
                    </p>
                </div>
            </div>
        </div>
    </body>`
    })
}

const sendPasswordResetOTP = async (to, otp, username) => {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    await transport.sendMail({
        from: `<${process.env.MAIL_USERNAME}>`,
        to: to,
        subject: "Password Reset",
        html: `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <div style="background-color: #f4f4f4; padding: 10px;">
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="background-color: #fff; padding: 20px; text-align: center; border-radius: 15px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #444; font-size: 24px;">Hello ${username},</h2>
                    <p style="font-size: 16px; color: #666;">
                        We received a request to reset your password. Please enter the following OTP to proceed:
                    </p>
                    <div style="font-size: 24px; color: #444; padding: 20px; border-radius: 5px; background-color: #f9f9f9; display: inline-block;">
                        ${otp}
                    </div>
                    <p style="font-size: 16px; color: #666;">
                        If you did not request this code, please ignore this email and your password will remain unchanged.
                    </p>
                    <p style="font-size: 16px; color: #666;">
                        Thanks
                    </p>
                </div>
            </div>
        </div>
    </body>
    `
    })
}




export { createHash, checkHash, sendOTP, sendPasswordResetOTP }