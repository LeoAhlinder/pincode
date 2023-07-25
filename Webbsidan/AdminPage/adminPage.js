async function NyAnvändare(){

    var today = new Date();
    var month = today.getMonth() + 1;

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

    var Namn = document.getElementById("name").value;
    var Kod = document.getElementById("kod").value;
    var lon = document.getElementById("lon").value;
    if (Kod.length != 4){
        alert("Koden måste vara 4 siffror lång")
        document.getElementById("name").value = "";
    }
    else{
        var data = {
            Namn: Namn,
            Kod: Kod,
            month:month,
            lon:lon
        }
        try {
        console.log(JSON.stringify(data))
            const res = await fetch("/api/ny-anvandare",{
                method: "POST", 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            const response = await res.json()
            if (response.message == "true"){
                document.getElementById("name").value = "";
                document.getElementById("kod").value = "";
                window.location.reload();
            }
         }catch{
            console.log(error)
         }
    }
}
async function AdminLogin() {


    var namn = document.getElementById("nameAdmin").value;
    var kod = document.getElementById("lösenordAdmin").value;

    var data = {
        namn: namn,
        kod: kod
    }

    try {
        const res = await fetch("/api/adminpage", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (result.message == "Admin exist") {
            window.location.href = "addnewusers.html"
           
        } else if (result.message == "Admin does not exist") {
            alert("Finns ingen admin med detta inlogg.");
        }
    } catch (error) {
        console.error(error);
    }
}

async function personal(){
    try{
        const res = await fetch("/api/personal",{
            method: "GET",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        );
        
        const response = await res.json()

        var personal = [];

        for (let i = 0;i < response.length;i++){
            const obj = response[i]

            for (let key in obj){
                if (obj.hasOwnProperty(key)){
                    personal.push(obj[key])
                }
            }

        }

        var personalContainer = document.getElementById("personal"); 

        for (let i = 0; i < personal.length; i++) {
            var elementContainer = document.createElement("div"); 
            var elementText = document.createTextNode(personal[i]);
            var button = document.createElement("button"); 
            button.innerHTML = "Ta Bort"; 
            
  
            button.addEventListener("click", function() {
                taBort(personal[i])
            });

            elementContainer.appendChild(elementText); 
            elementContainer.appendChild(button); 
            elementContainer.classList.add("button")
            personalContainer.appendChild(elementContainer); 
        }


        }catch (error){
        console.log(error)
    }

}


async function taBort(namn){

    console.log(namn)
    const res = await fetch("/api/tabort",{
        method:"POST",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({namn: namn})

    });

    const response = await res.json()

    console.log(response.message);

    if (response.message == "user deleted"){
        window.location.reload();
    }else{
        alert("Error")
    }
}

