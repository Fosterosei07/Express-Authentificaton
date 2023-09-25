const express = require('express');
const dotEnv = require('dotenv');

// configure .env
dotEnv.config()
const dbConnect = require('./dbConnect')

const port = process.env.port || 5000;

const app = express();



app.listen(port, () => {
    console.log(`server connected on http://localhost:${port}`);
    dbConnect.authenticate()
})