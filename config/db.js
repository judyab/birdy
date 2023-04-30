const mongoose = require("mongoose");

mongoose
    .connect("mongodb+srv://judyabdallah1:birdy0705@birdy.nsthjak.mongodb.net/birdy")
    // .connect("mongodb+srv://"+process.env.DB_USER_PASS +"@birdy.nsthjak.mongodb.net/birdy")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB", err));