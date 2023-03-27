const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const SERVER_PORT = process.env.PORT || 8080
const app = express()
const userRoutes = require("./routes/user")
const offerRoutes = require("./routes/offer")
mongoose.connect("mongodb://localhost:27017/user").then(() => {
    console.log("successfull connected to db")
}).catch(() => {
    console.log("failed to connect to database")
})
app.use(bodyParser.json())
app.listen(SERVER_PORT, () => {
    console.log("server started at" + " " + SERVER_PORT)
})
app.use("/user", userRoutes);
app.use("/offer", offerRoutes)
