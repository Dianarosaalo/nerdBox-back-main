const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cors = require("cors");

const medias = require(__dirname + '/routes/medias');

mongoose.connect('mongodb://localhost:27017/nerdBox', 
    {useNewUrlParser: true});

let app = express();

app.use(cors({origin: 'http://localhost:4200'})); //para el problema de los headers

app.use(express.json({limit: "10mb", extended: true}))
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

app.use('/medias', medias);

app.listen(8080);