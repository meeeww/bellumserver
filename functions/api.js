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

function generate_token(length) {
	//edit the token allowed characters
	var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
	var b = [];
	for (var i = 0; i < length; i++) {
		var j = (Math.random() * (a.length - 1)).toFixed(0);
		b[i] = a[j];
	}
	return b.join("");
}

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

router.post("/login", (req, res) => {//encriptar + sql injection + cliente envia contraseña encriptada (en el server vuelves a encriptar)

	const nombreInicio = req.body.nombreInicio
	const contrasenaInicio = req.body.contrasenaInicio
	const fecha = req.body.date
	const agente = req.body.agente
	const token = generate_token(128)

	const sqlSelect = "SELECT * FROM `cuentas` WHERE nombreCuenta = ? AND contraCuenta = ?"
	db.query(sqlSelect, [nombreInicio, contrasenaInicio], (err, result) => {
		if (err) {
			res.send(sqlSelect + " " + nombreInicio + " " + contrasenaInicio + " error")
		} else {
			const idUsuario = result[0]["id_cuenta"]

			const sqlSelect = "INSERT INTO `sesiones` (`id_usuario`, `primeraSesion`, `ultimaSesion`, `dispositivo`, `token`) VALUES ('" + idUsuario + "', '" + fecha + "', '" + fecha + "', '" + agente + "', '" + token + "')"
			db.query(sqlSelect, [idUsuario, fecha, fecha, agente, token], (err, result) => {
				if (err) {
					res.send(sqlSelect + " " + nombreInicio + " " + contrasenaInicio + " error2")
				} else {
					res.send(token)
				}
			})
		}
	})
})

router.post("/checksession", (req, res) => {//encriptar + sql injection + cliente envia contraseña encriptada (en el server vuelves a encriptar)

	const token = req.body.token

	const sqlSelect = "SELECT * FROM `sesiones` WHERE token = ?"
	db.query(sqlSelect, [token], (err, result) => {
		if (err) {
			res.send(sqlSelect + " " + nombreInicio + " " + contrasenaInicio + " error")
		} else {
			res.send(result)
		}
	})
})

router.get("/persona/:idPersona", (req, res) => {

	const idPersona = req.params.idPersona

	const sqlSelect = "SELECT * FROM `cuentas` WHERE id_cuenta = " + idPersona
	db.query(sqlSelect, (err, result) => {
		if (err) {
			res.send(sqlSelect + " " + idPersona + " error")
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

	console.log(req.body)
	//console.log(nombreContacto, apellidoContacto, correoContacto, asuntoContacto, mensajeContacto)

	const sqlInsert = "INSERT INTO `contacto` (`id_contacto`, `nombre`, `apellido`, `email`, `asunto`, `mensaje`) VALUES (NULL, ?, ?, ?, ?, ?);"
	console.log(sqlInsert)
	db.query(sqlInsert, [nombreContacto, apellidoContacto, correoContacto, asuntoContacto, mensajeContacto], (err, result) => {
		console.log(result)
		res.status(200)
		db.end()
	})
})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);