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

        const personalContainer = document.getElementById("personal"); 

        for (let i = 0; i < personal.length; i++) {
            const elementContainer = document.createElement("div"); 
            const elementText = document.createTextNode(personal[i]);
            const button = document.createElement("button"); 
            const lönInput = document.createElement("input")
            button.innerHTML = "Ta Bort"; 
            elementContainer.setAttribute("id",personal[i])
  
            button.addEventListener("click", function() {
                taBort(personal[i])
            });

            elementContainer.appendChild(elementText); 
            elementContainer.appendChild(button); 
            elementContainer.appendChild(lönInput)
            elementContainer.classList.add("button")
            personalContainer.appendChild(elementContainer); 
        }


        }catch (error){
        console.error(error)
    }

}

async function adminsdisplay(){

    try{
        const res = await fetch("/api/admins",{
            method:"GET",
            headers:{ 'Accept': 'application/json'},
        });

        const respone = await res.json();

        let admins = [];

        for (let i = 0;i < respone.length;i++){
            const obj = respone[i]

            for (let key in obj){
                if (obj.hasOwnProperty(key)){
                    admins.push(obj[key])
                }
            }
        }

        const adminContainer = document.getElementById("admin")
        for (let i = 0;i<admins.length;i++){
            const elementContainer = document.createElement("div")
            const elementText = document.createTextNode(admins[i])

            elementContainer.appendChild(elementText)
            elementContainer.classList.add("button");
            adminContainer.appendChild(elementContainer)

        }


    }catch(error){
        console.log(error)
    }

    
}

async function newAdmin(){

    let namn = document.getElementById("name").value;
    let kod = document.getElementById("kod").value;

    
    try{

        const data = {
            namn:namn,
            kod:kod
        }
        
        const res = await fetch("/api/newadmin",{
            method:"POST",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const response = await res.json()

        if (response.message = "Admin created"){
            window.location.reload();
        }
    }
    catch(error){
        console.error(error)
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

    if (response.message == "user deleted"){
        const element = document.getElementById(namn);
        if (element){
            element.remove();
        }else{
            alert("error")
        }

    }else{
        alert("Error")
    }
}

