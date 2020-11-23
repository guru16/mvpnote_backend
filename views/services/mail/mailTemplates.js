const sendMail = require('./config');

exports.sendVerificationMail = async(data) => {
    return new Promise( async(resolve, reject) => {
        try {
            var html = data.template ? data.template : `<center><h2>MVP Notes Mail</h2>
                        <br>
                        <a href="${data.url}" target="_blank">Click Here To Reset Password</a>
                        </center>`;

            var result = await sendMail(data.email, html);
            return resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
};