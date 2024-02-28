// // Import necessary modules
// const express = require("express");
// const path = require("path");
// const mysql = require("mysql");
// const bodyParser = require("body-parser");

// // Create an Express app
// const app = express();

// // Configure middleware
// const encoder = bodyParser.urlencoded();

// // Create a MySQL connection
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "calorietracker",
// });

// // Serve static files
// app.use("/images", express.static("images"));
// app.use("/style.css", express.static("style.css"));
// app.use(express.static(path.join(__dirname, "images")));

// // Set up routes
// app.get("/", async (req, res) => {
//   res.sendFile(path.join(__dirname + "/index.html"));
// });

// app.get("/log-inPage.html", async (req, res) => {
//   res.sendFile(path.join(__dirname + "/log-inPage.html"));
// });

// app.get("/sign-upPage.html", async (req, res) => {
//   res.sendFile(path.join(__dirname + "/sign-upPage.html"));
// });

// app.get("/mainPage.html", async (req, res) => {
//   res.sendFile(path.join(__dirname + "/mainPage.html"));
// });

// // Establish database connection
// connection.connect(function (error) {
//   if (error) throw error;
//   else console.log("connected to the database successfully!");
// });

// // Handle sign-up form submission
// app.post("/signup", encoder, function (req, res) {
//   // Extract user data from the request body
//   var username = req.body.username;
//   var password = req.body.password;
//   var age = req.body.age;
//   var weight = req.body.weight;
//   var gender = req.body.gender;

//   // Insert user data into the database
//   connection.query(
//     "INSERT INTO users (user_name, user_pass, age, weight, gender) VALUES (?, ?, ?, ?, ?)",
//     [username, password, age, weight, gender],
//     function (error, results, fields) {
//       if (error) {
//         console.error("Error during sign-up query:", error);
//         return res.status(500).send("Internal Server Error");
//       }

//       // Redirect to the welcome page upon successful sign-up
//       res.redirect("/welcome");
//     }
//   );
// });

// // Handle welcome page request
// app.get("/welcome", function (req, res) {
//   res.sendFile(__dirname + "/mainPage.html");
// });

// // Start the server
// app.listen(4000, () => {
//   console.log("Connected!");
// });
