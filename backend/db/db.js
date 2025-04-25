require('dotenv').config(); 
const { Pool } = require('pg');




const db =  new Pool(
    {
        host : process.env.PGHOST,
        user : process.env.PGUSER,
        password : process.env.PGPASSWORD,
        database : process.env.PGDATABASE,
        port: process.env.PGPORT,
    }
)

db.connect()
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.log(err);
    });
  

module.exports = db;




