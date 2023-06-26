import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
const currentDate = new Date();
/**
 * Configuring the env variables
 * that to be used in production mode
 */
dotenv.config();

// creating  express app:
const app = express();

/**
 * express.json() is used to pass data in JSON format
 * cors allows server to indicate any origin
 */
app.use(express.json());
app.use(cors());

/**
 * POST Request to send contact info
 */
app.post('/send' , (req,res) => {
    /**
     * Acepting the data fields
     * from the user 
     */
    const { name , email , message } = req.body;

    /**
     * Creating a nodemailer transporter 
     * which contains method of creatTrasnport()
     * contains sevice  to be user i.e Gmail in our case
     * and auth details like email id and password
     */
    const trasporter = nodemailer.createTransport({
        service : 'Gmail',
        auth : {
            user : process.env.USER,
            pass : process.env.PASSWORD
        }
    });

    /**
     * mailOptions contians the content of email
     * such as from, to, subject, text etc.
     */
    const mailOptions = {
        from : email,
        to : process.env.USER,
        subject : `Loan Enquiry from ${name}`,
        text : `Customer Details:\nName : ${name}\nEmail : ${email}\nMessage : ${message}`,
        data : currentDate,
    };

    //sending the email:
    trasporter.sendMail(mailOptions, (error,info) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Oops! An error occurred.' });
        } else {
            console.log('Email sent:', info.response);
            res.json({  message: 'Thank you for contacting us!' });
        }
    });
});

const port = 3000 || process.env.PORT;

app.listen(port, () => {
    console.log("Server is started!");
})
