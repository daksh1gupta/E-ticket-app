const express = require("express");
const path = require("path");
const axios = require("axios"); // npm i axios
const { title } = require("process");
const { register } = require("module");
const mongoose =require("mongoose");
const User = require("./Models/User");
const bcrypt = require("bcrypt"); //Middleware

app.use(express.urlencoded({extented: true}));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/FlightDB")
.then(()=>{
    console.log("MongoDB is connected")
})
.catch(err => console.log(err))

const port = 8080;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "ui"));

app.get("/", (req, res) => {
    // try{
    //     const response = axios("https://jsonplaceholder.typicode.com/users");
    //     {data : "Del to Chd"} 
    // }catch(error){

    // }
    res.render("index", {
        title: "Home Page"
    });
});

// Flight Route
app.get("/flight", async (req, res) => {

    try {

        const response = await axios.get("https://jsonplaceholder.typicode.com/users");

        // API data 
        const flights = response.data.map(user => ({
            name: user.name,
            from: user.address.city,
            to: user.address.street
        }));

        res.render("flight", {
            title: "Flight Page",
            flights: flights
        });

    } catch (error) {
        console.log(error);
        res.send("Error loading flights");
    }

});

app.get("/product", (req, res)=>{
    res.render("product", {
        title: "Product_page"
    })
})

//login route
app.get("/login", (req, res)=>{
    res.render("login", {
        title: "Login_Page"
    })
})

//register route
app.get("/register", (req, res)=>{
    try {
        const {name, email, password} = req.body;

        const existUser = await User.findOne({email});
        if(existUser){
            return res.send("User is already register")
        }

        //hash password
        const hashPassword = await bcrypt.hash(password, 15);

        
    } catch (error) {
        
    }
    res.render("register", {
        title: "Register_page"
    })
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});