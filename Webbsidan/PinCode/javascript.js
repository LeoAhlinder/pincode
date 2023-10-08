var pinCodeNumbers = 0;
var code = 0;
var pInput = document.getElementById("pinCode");

function PIN(number) {
  var pinInput = document.getElementById("pinCode");
  var currentPin = pinInput.value;
  if (number === 91) {
    pinInput.value = currentPin.slice(0, -1);
    if (pinCodeNumbers > 0){
      pinCodeNumbers--;
    }
  } else if (pinCodeNumbers < 4) {
    pinCodeNumbers++;
    pinInput.value = currentPin + number;
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


    try{

      const res = await fetch("http://localhost:3000/api/log",{
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      let pinInputV = document.getElementById("pinCode"); 
 
      const response = await res.json();

        if (response.message == "Success"){
          pinInputV.value = "";
          pinCodeNumbers = 0
        }
        else if (response.message == "time"){
          calculatedPay(response.lon);
          pinInputV.value = "";
          pinCodeNumbers = 0
        }
        else {
          // Error storing data
          console.log('Error storing data:', response.statusText);
        }
      }catch (error){
        console.error(error)
      }
  }
}


async function calculatedPay(pay){

  let today = new Date();
  let day = today.getDate(); 

  const res = await fetch("http://localhost:3000/api/time",{
    method:"GET",
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  const response = await res.json()
  
  const namn = response.namn;
  const borjade = response.message.började;
  const rastIn = response.message.börjaderast;
  const rastUt = response.message.slutaderast;
  const slutade = response.message.slutade;
  
  const [borjadeHour, borjadeMin] = borjade.split(":");
  const [slutadeHour, slutadeMin] = slutade.split(":");
  const timmar = parseInt(slutadeHour) - parseInt(borjadeHour) - 1;
  const min = parseInt(slutadeMin) + 60 - parseInt(borjadeMin);
  
  let totalTime;
  
  if (rastUt !== null && rastIn !== null) {
    const [rastInHour, rastInMin] = rastIn.split(":");
    const [rastUtHour, rastUtMin] = rastUt.split(":");
    const rasti = parseInt(rastUtHour) - parseInt(rastInHour) - 1;
    const rastu = parseInt(rastUtMin) + 60 - parseInt(rastInMin);
  
    totalTime = ((timmar - rasti) * 60 + (min - rastu)) / 60;
  } else {
    totalTime = (timmar * 60 + min) / 60;
  }
  
  const totalPay = totalTime * pay;
  
  const data = {
    totalPay,
    datum: day,
    namn,
  };
  
  await fetch("http://localhost:3000/api/lon",{
    method:"POST",
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });


}

