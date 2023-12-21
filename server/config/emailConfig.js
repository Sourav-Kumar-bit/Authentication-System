import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Configure Nodemailer transporter
let transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST,
    service: process.env.EMAIL_SERVICE,
    // port: process.env.EMAIL_PORT,
    // secure: false, // true for 465, false for others
    auth: {
        user: process.env.EMAIL_USER, // admin gmail ID
        pass: process.env.EMAIL_PASS // admin gmail password
    }
})

export default transporter;