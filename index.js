const express = require("express");
const path = require("path");
const axios = require("axios"); // npm i axios

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
        title: "Home Page",
        data : "Del to Chd"
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

