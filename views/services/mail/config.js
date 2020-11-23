const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dev.mvpnotes@gmail.com',
        pass: 'dev.mvpnotes2408'
    }
});

function sendMail(user, html) {
    return new Promise((resolve, reject) => {
        try {
            var mailOptions = {
                from: 'g.jain@braininventory.com',
                to: user,
                subject: 'reset password',
                html: html
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                    return reject(error);
                } else {
                    console.log(`Email sent: ${info.response}`);
                    return resolve(info);
                }
            });
        } catch (error) {
            return reject(error);
        }
    });
}

module.exports = sendMail;