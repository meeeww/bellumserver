const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')

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

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res) => {
	res.send("deployado")
})

app.get("/api/users", (req, res) => {
	res.json(users)
})

app.get("/api/info", (req, res) => {
	const sqlSelect = "SELECT * FROM contacto"
	db.query(sqlSelect, (err, result) => {
		if(err){
			res.send("error")
		} else {
			res.send(result)
		}
	})
})

app.post('/api/enviarmensaje', (req, res) => {

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

app.listen(process.env.PORT || 3001, () => {
	console.log("escuchando")
})