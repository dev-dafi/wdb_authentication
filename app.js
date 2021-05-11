require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
const port = 3000;

const uri = process.env.URI

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());


// SCHEMA 

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

// MODEL

const User = mongoose.model("User", userSchema); 

app.get("/", (req, res)=> {
    res.render("home");
});

app.get("/login", (req, res)=> {
    res.render("login");
});

app.get("/register", (req, res)=> {
    res.render("register");
});


app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    });

    newUser.save((err)=>{
        if(err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    })
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser)=>{
        if(!err) {
            // User with specific email on database?
            if(foundUser){
                // db pw equals user given pw
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        } else {
            console.log(err);
        }
    })

})

// APP LISTENER
app.listen(port, ()=> {
    console.log(`App listens on localhost:${port}`);
})