var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var login = require('../configs/query-mailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: login.config.user,
        pass: login.config.pw
    }
});

router.post('/send', (req, res, next) => {
    var content = `
    <p>You have a new contact request from the website.</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.number}</li>
      <li>I am a: ${req.body.mc}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

    var mail = {
        from: `${req.body.name} <${req.body.email}>`,
        to: "enquiry@arete.com.hk",
        subject: 'New Message from Contact Form',
        html: content
    }

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({Status: 'Failed'});
        } else {
            res.json({Status: 'Success'});
        }
    });
});

module.exports = router;