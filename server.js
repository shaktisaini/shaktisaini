"use strict";

let express =require('express')
let router =require('express').Router()
let  bodyParser = require('body-parser');

let cors =require('cors');
//database
require('./src/config/conn')

const app = express()
const port = process.env.PORT ||3000

// CORS Policy
app.use(cors())
// JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
   extended: false 
}));

//routes
require('./src/router/businessRouter')(app);
require('./src/router/businesslLogoRouter')(app);
console.log("server side run");

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})