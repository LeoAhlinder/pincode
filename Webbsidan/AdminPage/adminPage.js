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
         }catch(error){
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
        const res = await fetch("http://localhost:3000/api/adminpage", {
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
        const res = await fetch("http://localhost:3000/api/personal",{
            method: "GET",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        );
        
        const response = await res.json()

        const personal = [];
        const lön = [];
        const kodlista = [];

        for (let i = 0;i < response.length;i++){
            const obj = response[i]  
            for (let key in obj)
            {
                if (key === "Namn")
                {    
                    if (obj.hasOwnProperty(key)){
                        personal.push(obj[key])
                    }
                }
                else if(key === "lon"){
                    lön.push(obj[key])
                }
                else if (key === "Kod"){
                    kodlista.push(obj[key])
                }
            }

        }

        const personalContainer = document.getElementById("personal"); 

        for (let i = 0; i < personal.length; i++) {
            const elementContainer = document.createElement("div"); 
            const elementText = document.createTextNode(personal[i]);
            const br = document.createElement("br");
            const Removebutton = document.createElement("button"); 
            const lonButton = document.createElement("button")
            const kodButton = document.createElement("button")
            const lönInput = document.createElement("input")
            lönInput.setAttribute("id","lonInput" + i);
            lönInput.setAttribute("placeholder","Byt lön")
            const CurrentLön = " Lön: " + lön[i]
            const Currentkod = " Kod: " + kodlista[i]
            const kodInput = document.createElement("input")
            kodInput.setAttribute("id","kodInput" + i);
            kodInput.setAttribute("placeholder","Byt Kod")
            Removebutton.innerText = "Ta Bort"; 
            lonButton.innerText = "Byt"
            kodButton.innerText = "Byt"
            elementContainer.setAttribute("id",personal[i])
  
            Removebutton.addEventListener("click", () => {
                taBort(personal[i])
            });
            kodButton.addEventListener("click",() =>{
                let kod = document.getElementById("kodInput" + i).value;
                bytKod(personal[i],kod)
            });
            lonButton.addEventListener("click",() =>{
                let lon = document.getElementById("lonInput" + i).value;
                bytLon(personal[i],lon)
            });

            elementContainer.appendChild(elementText);
            elementContainer.appendChild(br)
            elementContainer.append(CurrentLön) 
            elementContainer.append(Currentkod)
            elementContainer.appendChild(lönInput)
            elementContainer.appendChild(lonButton)
            elementContainer.appendChild(kodInput)
            elementContainer.appendChild(kodButton)
            elementContainer.classList.add("button")
            elementContainer.appendChild(Removebutton); 
            personalContainer.appendChild(elementContainer); 
        }


        }catch (error){
        console.error(error)
    }

}

async function bytLon(namn,lon){
    try{
        const data = {
            namn: namn,
            lon:lon
        }

        const res = await fetch("http://localhost:3000/api/bytlon",{
            method:"POST",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const response = await res.json()

        if(response.message === "Changed"){
            location.reload()
        }
    }
    catch(error){
        console.error(error)
    }

}

async function bytKod(namn,kod){
    try{
        const data = {
            namn: namn,
            kod:parseInt(kod)
        }


        const res = await fetch("http://localhost:3000/api/bytkod",{
            method:"POST",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const response = await res.json()

        if(response.message === "Changed"){
            location.reload()
        }
    }
    catch(error){
        console.error(error)
    }

}

async function adminsdisplay(){

    try{
        const res = await fetch("http://localhost:3000/api/admins",{
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
        console.error(error)
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

