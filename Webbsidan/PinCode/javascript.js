
var pinCodeNumbers = 0;
var code = 0;
var pInput = document.getElementById("pinCode");

function PIN(number) {
  var pinInput = document.getElementById("pinCode");
  var currentPin = pinInput.value;
  if (number === 91) {
    pinInput.value = currentPin.slice(0, -1);
    pinCodeNumbers--;
  } else if (pinCodeNumbers < 4) {
    pinCodeNumbers++;
    pinInput.value = currentPin + number;
    console.log(pinInput.value);
    code = pinInput.value;
  }
}

/*
Typ 1 = In
Typ 2 = Rast In
Typ 3 = Rast Ut
Typ 4 = Ut
*/
async function Tid(Typ){
  var today = new Date();
  var day = today.getDate(); 
  var month = today.getMonth() + 1;
  var time = today.getHours() + ":" + today.getMinutes();

  switch(month){
    case 1:
        month = "Jan"
        break;
    case 2:
        month = "Feb"
        break;
    case 3:
        month = "Mars"
        break;
    case 4:
        month = "Apr"
        break;
    case 5:
        month = "May"
        break;
    case 6:
        month = "Jun"
        break;
    case 7: 
        month = "Jul"
        break;
    case 8:
        month = "Aug"
        break;
    case 9:
        month = "Sep"
        break;
    case 10:
        month = "Okt"
        break;
    case 11:
        month = "Nov"
        break;
    case 12:
        month = "Dec"
        break;
}

  if (pinCodeNumbers != 4) {
    alert("Pinen kräver 4a siffror");
  } else {
    // Create an object with the data to be sent to the server

    var data = {
      pinCode: code,
      tid: time,
      dag: day,
      month: month,
      In: Typ
    };

    pInput = "";
    try{
      const res = await fetch("api/tid",{
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      const response = await res.json();
        if (response.ok) {
          // Data stored successfully
          pinCodeV.value = '';
          pinCodeNumbers = 0;
        }  else if (response.message == "newTable"){
          newTable();
        }
        else {
          // Error storing data
          console.log('Error storing data:', response.statusText);
        }
      }catch{
        console.error(error)
      }
  }
}

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

