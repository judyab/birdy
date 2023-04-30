const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const initUser = require("./api/users").default;
const initMessage = require("./api/messages").default;
const db = require("./db");

const app = express();

// Utiliser les sessions
app.use(
  session({
    secret: "ma clé secrète",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db })
  })
);

// Monter les API users et messages sur /api
app.use("/api", initUser(db));
app.use("/api", initMessage(db));

// Lancer le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serveur écoutant sur le port ${port}`));
