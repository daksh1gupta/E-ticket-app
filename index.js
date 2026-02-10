const express = require("express");
const path = require("path");

const port = 8080;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"ui"));

app.get("/",(req, res)=>{
    res.render("index",{
        title: "Home_page"
    });
});

app.listen(port,()=>{
    console.log(`Server is up ${port}`);
})
