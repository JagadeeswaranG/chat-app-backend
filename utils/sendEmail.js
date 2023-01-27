const nodemailer = require("nodemailer");

sendEmail = async (email, subject, payload) => {
    try {
        var transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'jagadees.vg@gmail.com',
              pass: process.env.EMAIL_PASSWORD
            }
          });

          var mailOptions = {
            from: 'jagadees.vg@gmail.com',
            to: email,
            subject: subject,
            text: JSON.stringify(payload)
          };
          await transporter.sendMail(mailOptions, (err, data) => {
            if(err){
                console.log(err);
                return false
            }

            return true
          })
    } catch (error) {
        console.log(error);
       return false
    }
}

module.exports = { sendEmail }