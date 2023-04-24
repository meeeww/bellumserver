const express = require('express');
const serverless = require('serverless-http');
const mysql = require('mysql')
const app = express();
const router = express.Router();

//Get all students
router.get('/', (req, res) => {
  res.send('App is running...');
});

const db = mysql.createPool( {
	host: '212.227.32.40',
	user: 'root',
	password: '8m!25i!17I',
	database: 'bellum'
})

let users = [
	{
		id: 1,
		nombre: "Juan"
	}
]

router.get("/users", (req, res) => {
	res.json(users)
})

router.get("/info", (req, res) => {
	const sqlSelect = "SELECT * FROM contacto"
	db.query(sqlSelect, (err, result) => {
		if(err){
			res.send("error")
		} else {
			res.send(result)
		}
	})
})

router.post('/enviarmensaje', (req, res) => {

	console.log("hey")

	const nombreContacto = req.body.nombreContacto
	const apellidoContacto = req.body.apellidoContacto
	const correoContacto = req.body.correoContacto
	const asuntoContacto = req.body.asuntoContacto
	const mensajeContacto = req.body.mensajeContacto

	const sqlInsert = "INSERT INTO `contacto` (`id_contacto`, `nombre`, `apellido`, `email`, `asunto`, `mensaje`) VALUES (NULL, ?, ?, ?, ?, ?);"
	db.query(sqlInsert, [nombreContacto, apellidoContacto, correoContacto, asuntoContacto, mensajeContacto], (err, result) => {
console.log(result)
	})
})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);