const mongoose = require('mongoose');



  
const connection = mongoose.connect("mongodb://127.0.0.1:27017/production_auth").then(()=>{
    console.log("database connection succesful");
}).catch(()=>{
    console.log("database not connected")
})