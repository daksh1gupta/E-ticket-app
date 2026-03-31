const express = require("express");
const path = require("path");
const axios = require("axios"); // npm i axios
const { title } = require("process");
const { register } = require("module");
const mongoose =require("mongoose");
const User = require("./Models/User");
const bcrypt = require("bcrypt"); //Middleware
const session = require("express-session");
const port = 8080;
const app = express();

app.use(express.urlencoded({extented: true}));
app.use(express.json());
app.use(session({
    secret: "key123456",
    resave: false,
    saveUninitialized: false,
}))


mongoose.connect("mongodb://localhost:27017/FlightDB")
.then(()=>{
    console.log("MongoDB is connected")
})
.catch(err => console.log(err))

//MIddleWare
function isLoggedIn(req, res, next){
    if(req.session.user){
        next();
    }else{
        res.redirect("/login")
    }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "ui"));

app.get("/", isLoggedIn, (req, res) => {
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
app.post("/login", async (req, res)=>{
    try {
        const { email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.send("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            req.session.user = user; //store the session
            return res.redirect("/");
        }else{
            return res.send("Invalid Password")
        }
    } catch (error) {
        console.log(error);
        res.send("Error is UserLogin");
    }
    
})

//register route
app.post("/register", async (req, res)=>{
    try {
        const {name, email, password} = req.body;

        const existUser = await User.findOne({email});
        if(existUser){
            return res.send("User is already register")
        }

        //hash password
        const hashPassword = await bcrypt.hash(password, 15);

        const newUser = new User ({
            name, 
            email,
            password: hashPassword
        })

        await newUser.save();
        
        res.redirect("/login");


    } catch (error) {
        console.log(error);
        res.send("Error in registering the user")
    }
})

app.get("/login", (req,res)=>{
    res.render("login", {
        title: "Login_page"
    })
})
//register
app.get("/register", (req,res)=>{
    res.render("register", {
        title: "Register_page"
    })
})

//Logout route
app.get("/logout", (req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/login");
    })
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});