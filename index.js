const exp = require("constants");
const mysql = require("mysql");
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // Set EJS as the view engine
const encoder = bodyParser.urlencoded({ extended: true });
app.set("views", path.join(__dirname, "views"));
const session = require('express-session');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "calorietracker",
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));



app.use("/images", express.static("images"));
app.use("/style.css", express.static("style.css"));

app.use(express.static(path.join(__dirname, "images")));

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/api.js", async (req, res) => {
  res.sendFile(path.join(__dirname + "/api.js"));
});

app.get("/log-inPage.html", async (req, res) => {
  res.sendFile(path.join(__dirname + "/log-inPage.html"));
});

app.get("/sign-upPage.html", async (req, res) => {
  res.sendFile(path.join(__dirname + "/sign-upPage.html"));
});

app.get("/mainPage.html", async (req, res) => {
  res.sendFile(path.join(__dirname + "/mainPage.html"));
});


// app.get("/home", (req, res) => {
//   // Assuming you have a session and the user information is stored in req.session.user
//   const loggedInUser = req.session.user;
//   console.log('Logged-in user:', loggedInUser);

//   if (!loggedInUser) {
//     // Redirect or handle the case where no user is logged in
//     res.redirect("/login");
//     return;
//   }

//   // Modify the SQL query to fetch details only for the logged-in user
//   let query = "SELECT * FROM users WHERE user_name = ?;";
//   console.log('SQL Query:', query);

//   connection.query(query, [loggedInUser.user_name], (error, results) => {
//     if (error) {
//       console.log(error);
//       res.send("Internal Server Error");
//       return;
//     }

//     try {
//       // Assuming there should be only one user with the given username
//       const user = results[0];
//       res.render("mainPage.ejs", { user });
//     } catch (error) {
//       console.error("Error rendering page:", error);
//       res.send("Internal Server Error");
//     }
//   });
// });

app.get("/home", (req, res) => {
  // Assuming you have a session and the user information is stored in req.session.user
  const loggedInUser = req.session.user;
  console.log('Logged-in user:', loggedInUser);

  if (!loggedInUser) {
    // Redirect or handle the case where no user is logged in
    res.redirect("/login");
    return;
  }

  // Modify the SQL query to fetch details only for the logged-in user
  let query = "SELECT * FROM users WHERE user_name = ?;";
  console.log('SQL Query:', query);

  connection.query(query, [loggedInUser.user_name], (error, results) => {
    if (error) {
      console.log(error);
      res.send("Internal Server Error");
      return;
    }

    try {
      // Assuming there should be only one user with the given username
      const user = results[0];

      // Now, fetch meals for the logged-in user
      let mealsQuery = "SELECT * FROM meal WHERE TRIM(user_name) = ?;";
      connection.query(mealsQuery, [loggedInUser.user_name], (mealsError, mealsResults) => {
        if (mealsError) {
          console.log(mealsError);
          res.send("Internal Server Error");
          return;
        }

        // Assuming 'mealsResults' contains an array of meals
        const meals = mealsResults;

        // Render the template with both user and meals data
        res.render("mainPage.ejs", { user, meals });
      });
    } catch (error) {
      console.error("Error rendering page:", error);
      res.send("Internal Server Error");
    }
  });
});

app.get("/fetchData", (req, res) => {
  const loggedInUser = req.session.user;

  if (!loggedInUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const selectedDate = req.query.selectedDate;

  let mealsQuery = "SELECT * FROM meal WHERE TRIM(user_name) = ? AND DATE(time) = ?;";
  console.log('SQL Query:', mealsQuery, [loggedInUser.user_name, selectedDate]); // Log the query and parameters

  connection.query(mealsQuery, [loggedInUser.user_name, selectedDate], (mealsError, mealsResults) => {
    if (mealsError) {
      console.log('Error executing query:', mealsError);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Map the results to format the date and time
    const formattedMeals = mealsResults.map(meal => {
      const formattedTime = new Date(meal.time).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
        timeZone: 'Asia/Kolkata' // Set the specific timezone, replace with your desired timezone
      });

      return { ...meal, formattedTime };
    });

    console.log('Query Results:', formattedMeals); // Log the formatted results

    res.json(formattedMeals);
  });
});


app.get("/api/meals", (req, res) => {
  const loggedInUser = req.session.user;
  const selectedDate = req.query.date;

  if (!loggedInUser) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  // Modify the SQL query to fetch meals for the logged-in user and selected date
  const mealsQuery = "SELECT * FROM meal WHERE TRIM(user_name) = ? AND DATE(time) = ?;";
  connection.query(mealsQuery, [loggedInUser.user_name, selectedDate], (error, mealsResults) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const meals = mealsResults;
    res.json(meals);
  });
});

connection.connect(function (error) {
  if (error) throw error;
  else console.log("connected to the database successfully!");
});

app.post("/", encoder, function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  connection.query(
    "select * from users where user_name = ? and user_pass = ?",
    [username, password],
    function (error, results, fields) {
      var username = req.body.username;
      var password = req.body.password;

      connection.query(
        "SELECT * FROM users WHERE user_name = ? AND user_pass = ?",
        [username, password],
        function (error, results, fields) {
          if (error) {
            console.error("Error during login query:", error);
            return res.status(500).send("Internal Server Error");
          }

          try {
            if (results.length > 0) {
              req.session.user = results[0];
              res.redirect("/home");
            } else {
              // Handle the case where the login is unsuccessful
              res.status(401).send("Invalid username or password");
            }
          } catch (error) {
            // Log and handle unexpected errors during redirection
            console.error("Error during redirection:", error);
            res.status(500).send("Internal Server Error");
          }
        }
      );
    }
  );
});

app.get("/welcome", function (req, res) {
  res.sendFile(__dirname + "/mainPage.html");
});


app.post("/signup", function (req, res) {
  // get data from forms and add to the table called user..
  var name = req.body.username;
  var password = req.body.password;
  var weight = req.body.weight;
  var height = req.body.height;
  var gender = req.body.gender;
  var age = req.body.age;

  connection.query("INSERT INTO users (user_name, user_pass, Weight, Height, Gender, Age) VALUES (?, ?, ?, ?, ?, ?)", [name, password, weight, height, gender, age], function (err, result) {
    if (err) {
      // Check for duplicate entry error
      if (err.code === 'ER_DUP_ENTRY') {
        console.log("Duplicate entry error: The username '" + name + "' is already taken.");
        return res.status(409).send("The username is already taken. Please choose a different one.");
      } else {
        throw err;
      }
    }

    console.log("1 record inserted");
    res.redirect("/login");
  });
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/log-inPage.html");
});
app.get("/home", function (req, res) {
  res.sendFile(__dirname + "/mainPage.ejs");
});

app.post("/updateDetails", (req, res) => {
  const loggedInUser = req.session.user;
  const newWeight = req.body.newWeight;
  const newHeight = req.body.newHeight;

  if (!loggedInUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Update user details in the database
  connection.query(
    "UPDATE users SET Weight = ?, Height = ? WHERE user_name = ?",
    [newWeight, newHeight, loggedInUser.user_name],
    (error, results) => {
      if (error) {
        console.log('Error updating user details:', error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      console.log('User details updated successfully');
      res.redirect("/home");
    }
  );
});

// app.post("/meal", function (req, res) {
//   // get data from forms and add to the table called user..
//   var user_name = req.body.user_name;
//   var meal_name = req.body.meal_name;
//   var calorie = req.body.calorie;
//   var protein = req.body.protein;


//   connection.query("INSERT INTO meal (user_name, meal_name, calorie, protein, time) VALUES (?, ?, ? , ? , NOW())", [user_name, meal_name, calorie, protein,], function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//     res.redirect("/home");
//   });
// });

app.post("/meal", function (req, res) {
  // get data from forms and add to the table called user..
  var user_name = req.body.user_name;
  var meal_name = req.body.meal_name;
  var calorie = req.body.calorie;
  var protein = req.body.protein;
 
  if (user_name && meal_name && calorie>0) {
    connection.query("INSERT INTO meal (user_name, meal_name, calorie, protein, time) VALUES (?, ?, ? , ? , NOW())", [user_name, meal_name, calorie, protein], function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      console.log("1 record inserted");
      res.redirect("/home");
    });
  }

  // Insert data into the meal table

});


app.listen(4000, () => {
  console.log("Connected!");
});
