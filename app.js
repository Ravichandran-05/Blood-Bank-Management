var express = require("express");
var bodyParser = require("body-parser");

const mongoose = require("mongoose");
mongoose.connect(
    "mongodb+srv://ravib_05:ravichandran@cluster0.pgad7.mongodb.net/Blood_Bank_Management"
);

const Schema = mongoose.Schema;

const serialSchema = new Schema({
    name: { type: String },
    age: { type: Number },
    gender: { type: String },
    phone: { type: Number },
    email: { type: String },
    blood_group: { type: String },
    place: { type: String },
    date: { type: Date },
    time: { type: String },
});
// const db = mongoose.model('serials', serialSchema);
const db = mongoose.model("Model", serialSchema, "details", {});

db.on("error", console.log.bind(console, "connection error"));
db.once("open", function(callback) {
    console.log("connection succeeded");
});
const port = process.env.PORT || 3000;
var app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.post("/sign_up", function(req, res) {
    var name = req.body.name;
    var age = req.body.age;
    var gender = req.body.gender;
    var phone = req.body.phone;
    var email = req.body.email;
    var bg = req.body.bg;
    var place = req.body.place;
    var date = req.body.date;
    var time = req.body.time;

    var data = {
        name: name,
        age: age,
        gender: gender,
        phone: phone,
        email: email,
        blood_group: bg,
        place: place,
        date: date,
        time: time,
    };
    db.create(data)
        .then((result) => {
            console.log("Inserted successfully");
        })
        .catch((err) => {
            console.log(err);
        });

    return res.redirect("signup_success.html");
});

app.post("/search", function(req, res) {
    var searchbg = req.body.searchbg;

    var data = {
        blood_group: searchbg,
    };
    let totalItems;
    db.find(data)
        .then((products) => {
            console.log(products.length);
            // totalItems = products.length;
            res.render("response/response", {
                prods: products,
                // len: totalItems,
                pageTitle: "Blood Bank",
                path: "/bloodbank",
            });
        })
        .catch((err) => {
            console.log(err);
        });

    // return res.redirect("signup_success.html");
});

app.post("/allrequest", function(req, res) {
    db.find()
        .then((products) => {
            console.log(products.length);
            res.render("response/response", {
                prods: products,
                // len: totalItems,
                pageTitle: "Blood Bank",
                path: "/bloodbank",
            });
        })
        .catch((err) => {
            console.log(err);
        });

    // return res.redirect("signup_success.html");
});

app
    .get("", function(req, res) {
        return res.redirect("home.html");
    })
    .listen(port);

console.log("server listening at port 3000");