// const mysql = require("mysql");
// const express = require("express");
// const bodyParser = require("body-parser");
// const encoder = bodyParser.urlencoded();

// const app = express();
// app.use("/images",express.static("images"));

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "calorietracker"
// });

// // connect to the database
// connection.connect(function(error){
//     if (error) throw error
//     else console.log("connected to the database successfully!")
// });

// app.get("/",function(req,res){
//     res.sendFile(__dirname + "/log-inPage.html");
// })


// app.post("/",encoder, function(req,res){
//     var username = req.body.username;
//     var password = req.body.password;

//     connection.query("select * from users where user_name = ? and user_pass = ?",[username,password],function(error,results,fields){
//         if (results.length > 0) {
//             res.redirect("/welcome");
//         } else {
//             res.redirect("/");
//         }
//         // res.end();
//     })
// })

// // when login is success
// app.get("/welcome",function(req,res){
//     res.sendFile(__dirname + "/mainPage.html")
// })

// // set app port 
// app.listen(4000);