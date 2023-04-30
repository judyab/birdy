const express = require('express');
const userApi = require('./api/apiUser');
require('./config/db');
const app = express();
const port = 5000;


// routes
app.use('/api/user', userApi);


//serveur
app.listen(port, () => {
  console.log(`Serveur actif sur le port ${port}`);
});