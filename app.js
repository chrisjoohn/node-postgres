const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config()

const app = express();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD 
    }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded());


app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('/experiences', (req, res) => {
    res.sendFile('experience.html', {root: path.join(__dirname, 'public')});
});

app.get('/skills', (req, res) => {
    res.sendFile('skills.html', {root: path.join(__dirname, 'public')});
});

app.get('/about', (req, res) => {
    res.sendFile('about.html', {root: path.join(__dirname, 'public')});
});


app.post('/send-email', (req, res) => {
    const body = req.body;

    const email = body.email;
    const subject = body.subject;
    const message = body.message;

    console.log('Sending message...');

    try{
        transporter.sendMail({
            from: 'No Reply <chrisjohnmulingbayan@gmail.com>',
            to : email,
            subject: subject,
            text: message
        }, () => {
            res.redirect('/about?success');
            console.log('Message sent!');
        });
    }catch(error){
        console.log(error);
        res.redirect('/about?success');
    }

});



app.listen(process.env.PORT, () => {
    console.log("Listening to port  3000...");
});