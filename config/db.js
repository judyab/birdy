const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://judyabdallah1:birdy0705@birdy.nsthjak.mongodb.net/birdy")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur lors de la connexion à la base de données"));
db.once("open", () => console.log("Connecté à la base de données"));

module.exports = db;
