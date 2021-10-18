const express = require('express')
const cookieParser = require('cookie-parser')
const app = express();


// server your css as static
// cookie
app.use(express.static(__dirname));
app.use(cookieParser());

app.get('/', (req, res) => {
    return res.sendFile(__dirname + "/index.html");
});


app.get("/login", (req, res) => {
    if (req.cookies.api_key) {
      res.redirect('/');
    } else {
      res.sendFile(__dirname + "/login.html");
    }
});

app.get('/set_cookie/', function(req, res) {
    const api_key = req.query.key_api;
    res.cookie("api_key", api_key);
    res.redirect('/');
});

app.get("/signup", (req, res) => {
  if (req.cookies.api_key) {
    res.redirect('/');
  } else {
    res.sendFile(__dirname + "/signup.html");
  }
});

app.get("/check_cookie", function (req, res) {
    const key_api_check_admin = req.query.key_api_check_admin;
    res.cookie("key_api_check_admin", "true");
    res.redirect('/');
});

app.get("/admin", (req, res) => {
  if (req.cookies.api_key && req.cookies.key_api_check_admin === "true") {
    res.sendFile(__dirname + "/admin.html");
  } else {
    res.redirect('/');
  }
});

app.post("/profile", (req, res) => {
    if (req.cookies.api_key) {
        res.sendFile(__dirname + "/profile.html");
    } else {
        res.cookie("to_login", "true");
        res.redirect('/login');
    }
});

app.get("/profile", (req, res) => {
    if (req.cookies.api_key) {
        res.sendFile(__dirname + "/profile.html");
    } else {
        res.cookie("to_login", "true");
        res.redirect('/login');
    }
});

app.listen(8080, () => {
    console.log("Application started and Listening on port 8080");
});