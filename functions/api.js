const express = require('express');
const serverless = require('serverless-http');
const mysql = require('mysql')
const app = express();
const router = express.Router();
const cors = require('cors')

app.use(cors())
app.use(express.json())

router.get('/', (req, res) => {
	res.send('App is corriendo...');
});

const db = mysql.createPool({
	host: '212.227.32.40',
	user: 'root',
	password: '8m!25i!17I',
	database: 'bellum'
})

let users = [
	{
		id: 1,
		nombre: "Jusans"
	}
]

router.get("/users", (req, res) => {
	res.json(users)
})

router.get("/info", (req, res) => {
	const sqlSelect = "SELECT * FROM contacto"
	db.query(sqlSelect, (err, result) => {
		if (err) {
			res.send("error")
		} else {
			res.send(result)
		}
	})
})

router.post('/enviarmensaje', (req, res) => {

	const nombreContacto = req.body.nombreContacto
	const apellidoContacto = req.body.apellidoContacto
	const correoContacto = req.body.correoContacto
	const asuntoContacto = req.body.asuntoContacto
	const mensajeContacto = req.body.mensajeContacto

	console.log("hey")
	console.log(nombreContacto, apellidoContacto, correoContacto, asuntoContacto, mensajeContacto)

	const sqlInsert = "INSERT INTO `contacto` (`id_contacto`, `nombre`, `apellido`, `email`, `asunto`, `mensaje`) VALUES (NULL, ?, ?, ?, ?, ?);"
	console.log(sqlInsert)
	db.query(sqlInsert, [nombreContacto, apellidoContacto, correoContacto, asuntoContacto, mensajeContacto], (err, result) => {
		console.log(result)
		res.status(200)
	})
})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);