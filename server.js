const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http').createServer(app);
const morgan = require("morgan");
const bcrypt = require('bcryptjs');
const cors = require('cors');


const saltr = 10;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//app.use(morgan("dev")) for response time




app.use(cors());


/*
const connection = mysql.createConnection({
  host: process.env['db.host'],
  user: process.env['db.user'],
  password: process.env['db.password'],
  database: process.env['db.name'],
});
*/
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'testnärvaro',
});


connection.connect((error) => {
    if(error){
      console.log('Error connecting to the MySQL Database',error);
      return;
    }
    console.log('Connection established sucessfully');
    
  });

http.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});


function validateRequiredFields(requiredFields) {
  return function (req, res, next) {
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(500).json({ error: `Missing required field: ${field}` });
      }
    }
    next();
  };
}

app.get("/api/personal",validateRequiredFields([]),function(req,res){
  connection.query("SELECT Namn,Kod,lon FROM personal",function(error,results){
    res.send(results)
  })
})

app.post("/api/tabort",validateRequiredFields(['namn']),function(req,res){
  const data = req.body;

  connection.query("DELETE FROM personal WHERE Namn = ?",[data.namn],function(error,results){
    if (error){
      console.log(error)
    }else{
      res.json({message : "user deleted"})
    }
  });
})


app.post('/api/log',validateRequiredFields(["tid","month","In","pinCode","dag"]), function (req, res) {
    const data = req.body; 
    const Tid = data.tid;
    const month = data.month
    const Typ = data.In

    
    const query = "SELECT * FROM personal WHERE Kod = ?";
    connection.query(query, [data.pinCode], function (error, results, fields) {
      if (error) {
        console.log('Error executing SELECT query:', error);
        res.status(500).json({ error: 'Error checking data in the database' });
      } else {

        if (results.length > 0) {
          const user = results[0];
          const namn = user.Namn + " " + month;
          const lon = user.lon;
          
          connection.query("SELECT * FROM ??",[namn],function(error,results){
            if (error){
              console.log("create table")
              res.json({message:"newTable"});
              //If the table does not exist, create it then add the data.
              const columns = [
                "datum VARCHAR(255)",
                "började VARCHAR(255)",
                "börjaderast VARCHAR(255)",
                "slutaderast VARCHAR(255)",
                "slutade VARCHAR(255)",
                "betalt INT(52)"
              ];
              
              const createTableQuery = `CREATE TABLE ?? (${columns.join(', ')})`;
              
              connection.query(createTableQuery,[namn],function(error,results){
                if (error){
                  console.log(error)
                }else{
                  if (Typ == 4){
                    res.json({message:"time",lon:lon})
                  }
                  newData(Typ,namn,data.dag,Tid)
                  res.json({message:"Success"})
                }
              });
            } //Table exist, just insert the data
            else{
      
                if (Typ === 4){
                  res.json({message:"time",lon:lon})
                }else{
                  res.json({message:"Success"})
                }

                newData(Typ,namn,data.dag,Tid)

            }
          })
          
        } else {
          // Data does not exist in the table
          // Perform necessary actions for inserting the data
          res.status(200).json({ message: 'Data does not exist' });
        }
      }
    });
  });
;

function newData(type,namn,dag,Tid)
{
  let currentType = "";
  switch(type){
    case 2:
      currentType = "börjaderast" 
    break;

    case 3: 
      currentType = "slutaderast"
    break;

    case 4:
      currentType = "slutade"
    break;
  }

  if (Typ == 1){//Clock In
    connection.query("INSERT INTO ?? (datum,började) VALUES (?,?)",[namn,dag,Tid],function(error){
      if (error){
        console.log(error)
      }
  });
  }else{
    //Check if user already has started their break
    connection.query(`SELECT ${currentType} FROM ??`,[namn],function(error,results){
      if (error){
        console.log(error)
      }
      else if (results.length > 0){
        console.log("user has started break already")
      }
      else{
        console.log("hasnt started break already")
      }

    })
    connection.query(`UPDATE ?? SET ${currentType} = ? WHERE datum = ?`,[namn,Tid,dag],function(error){
      if (error){
        console.log(error)
      }

    })
  }
}

app.post("/api/ny-anvandare", validateRequiredFields(["Namn", "Kod", "lon"]), function(req, res) {
  const data = req.body;
  console.log(data.Namn, data.Kod, data.lon);

    const query = "INSERT INTO personal (namn, Kod, lon) VALUES (?, ?, ?)";
    connection.query(query, [data.Namn, data.Kod, data.lon], function(error, results, fields) {
      if (error) {
        console.log("Error: ", error);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        res.json({ message: "true", lon: data.lon });
      }
    });
  });;


app.get("/api/admins",validateRequiredFields([]),function(req,res){
  connection.query("SELECT Namn FROM admins",function(error,results){
    res.json(results)
  })
})

app.post("/api/newadmin",validateRequiredFields(["namn","kod"]),function(req,res){
  const admin = req.body;
  const query = "INSERT INTO admins (Namn, Lösenord) VALUES (?, ?)";

  connection.query(query,[admin.namn,admin.kod],function(error,results){
    if (error){
      console.log("error",error)
    }
    else{
      res.json({message:"Admin created"});
    }
  })
})

app.post("/api/adminpage", validateRequiredFields(["namn", "kod"]), function(req, res) {
  const admin = req.body;

  console.log("test")
  const query = "SELECT * FROM admins WHERE Namn = ? AND Lösenord = ?";


  connection.query(query, [admin.namn,admin.kod], function(error, results, fields) {
    if (error) {
      console.log("Error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.length > 0) {
      res.json({message:"Admin exist"});

    } else {
      res.json({ message: "Admin does not exist" });
    }
  });
});
  
app.post("/api/lon",validateRequiredFields(["namn","totalPay","datum"]),function(req,res){
  const data = req.body;

  connection.query("UPDATE ?? SET betalt = ? WHERE datum = ?",[data.namn,data.totalPay,data.datum],function(error,results){
    if (error){
      console.log(error)
    }
  })
})

app.post("/api/bytlon",validateRequiredFields(["namn","lon"]),function(req,res){
  const data = req.body;
  console.log("WE UP")
  connection.query("UPDATE personal SET lon = ? WHERE Namn = ?",[data.lon,data.namn],function(error,results){
    if(error){
      console.log(error)
    }
    else{
      res.json({message:"Changed"});
    }
  })
})

app.post("/api/bytkod",validateRequiredFields(["namn","kod"]),function(req,res){
  const data = req.body;
  connection.query("UPDATE personal SET Kod = ? WHERE Namn = ?",[data.kod,data.namn],function(error,results){
    if(error){
      console.log(error)
    }
    else{
      res.json({message:"Changed"});
    }
  })
})

module.exports = app;
