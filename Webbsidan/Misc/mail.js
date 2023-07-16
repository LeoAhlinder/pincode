const nodemailer = require("nodemailer")

const data = "test"

function newTable(){
  const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM',
      pass: 'REPLACE-WITH-YOUR-GENERATED-PASSWORD'
    }
  });
  
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Leo" <ahlinder.leo@gmail.com>', // sender address
      to: "ahlinder.leo@icloud.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: data, // plain text body
    });
}
}
