require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const colors = require('color');

const app = express();




app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

//configuracion global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err, res) =>{
	if (err) throw err;

	console.log('Base de datos online =====>'.green)
});

app.listen(process.env.PORT, () => {
	console.log('Escuchando puerto', process.env.PORT);
});