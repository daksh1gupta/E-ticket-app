const express = require("express");
const path = require("path");
const { title } = require("process");

const port = 8080;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"ui"));
//home route
app.get("/",(req, res)=>{
    res.render("index",{
        title: "Home_page"
    });
});

//flight route
app.get("/flight",(req,res)=>{
     res.render("flight",{
        title: "Flight",
        flightDetail: "indigo",
        amount : "5500",
        Dtime : "16:50",
        hours: "2:00"
     });
});

app.listen(port,()=>{
    console.log(`Server is up ${port}`);
})
