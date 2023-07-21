const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http').createServer(app);
const morgan = require("morgan");
const bcrypt = require('bcryptjs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Webbsidan', 'PinCode')));


//app.use(morgan("dev")) for response time

  // Serve index.html
app.get('/', function (req, res) {
 res.sendFile(path.join(__dirname, 'Webbsidan', 'PinCode', 'index.html'));
});

// Serve AdminPage
app.use('/admin', express.static(path.join(__dirname, 'Webbsidan', 'AdminPage')));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'testnärvaro',
});


connection.connect((error) => {
    if(error){
      console.log('Error connecting to the MySQL Database');
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
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    next();
  };
}

app.get("/api/personal",validateRequiredFields([]),function(req,res){
  connection.query("SELECT Namn FROM personal",function(error,results){
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


app.post('/api/tid',validateRequiredFields(["tid","month","In","pinCode","dag"]), function (req, res) {
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
          console.log("data exist in table")
          // Data already exists in the table
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
                }
              });
            } //Table exist, just insert the data
            else{
              if (Typ == 4){
                res.json({message:"time",lon:lon})
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

function newData(Typ,namn,dag,Tid)
{
  if (Typ == 1){//Clock In
    connection.query("INSERT INTO ?? (datum,började) VALUES (?,?)",[namn,dag,Tid],function(error){
      if (error){
        console.log(error)
      }
           
  });
  }else if (Typ == 2){
    connection.query("UPDATE ?? SET börjaderast = ? WHERE datum = ?",[namn,Tid,dag],function(error){
      if (error){
        console.log(error)
      }

    })
  }
  else if (Typ == 3){
    connection.query("UPDATE ?? SET slutaderast = ? WHERE datum = ?",[namn,Tid,dag],function(error){
      if (error){
        console.log(error)
      }

    })
  }
  else if (Typ == 4){//Clock out
    connection.query("UPDATE ?? SET slutade = ? WHERE datum = ?",[namn,Tid,dag],function(error){
      if (error){
        console.log(error)
      }
      else{
        connection.query("SELECT * FROM ?? WHERE datum = ?",[namn,dag],function(error,results){
          if (error){
            console.log(error)
          }
          else{
            const time = results[0];
            app.get("/api/time",function(req,res){
              res.json({message:time,namn:namn})
            });
          }
        });
      }
    });
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


app.post("/api/adminpage", validateRequiredFields(["namn", "kod"]), function(req, res) {
  const admin = req.body;
  const query = "SELECT * FROM admins WHERE Namn = ?";

  connection.query(query, [admin.namn], function(error, results, fields) {
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
  
app.post("/api/lon",validateRequiredFields(["namn","betalt","datum"]),function(req,res){
  const data = req.body;

  connection.query("UPDATE ?? SET betalt = ? WHERE datum = ?",[data.namn,data.betalt,data.datum],function(error,results){
    if (error){
      console.log(error)
    }
  })
})

module.exports = app;
