const nodemailer = require('nodemailer');
const mailer = (mailBody) => {
    console.log('Mail ke andar aaaya');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kjsceintern@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
    var mailOptions = {
        from: 'kjsceintern@gmail.com',
        to: `${mailBody.to.join(', ')}`,
        subject: mailBody.subject,
        html: mailBody.text
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.log(err.message);
        }
        console.log('Message Sent : %s', info.messageId);
        console.log('Preview URL : %s', info.getTestMessageURL(info));
    });
}
module.exports = mailer;