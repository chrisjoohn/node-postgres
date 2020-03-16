const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

const db = require('./queries');
const bodyParser = require('body-parser');


dotenv.config();

const app = express();
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD 
    }
})

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
  extended: true
  })
);


app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.delete('/delete/:id', db.deleteUser);
app.put('/update/:id', db.updateUser);
app.post('/create', db.createUser);



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


const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`Listening to port  ${PORT}...`);
});
