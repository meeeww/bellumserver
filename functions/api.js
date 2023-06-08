const express = require('express');
const serverless = require('serverless-http');
const mysql = require('mysql')
const app = express();
const router = express.Router();
const cors = require('cors')

app.use(cors())
app.use(express.json())

//https://bellumserver.netlify.app/.netlify/functions/api/ <- la ruta de postman y axios
//para hacer un deploy (actualizar los scripts) hay que abrir la terminal y escribir npm run dev y darle enter cuando lo pida

router.get('/', (req, res) => { //la app funciona
	res.send('App is corriendo...');
});

const db = mysql.createPool({ //crear la conexion a la base de datos
	host: '212.227.32.40',
	user: 'bellumweb',
	password: 'j*CjZycl3DQdgr/n',
	database: 'bellum'
})

function generate_token(length) { //generar token para la tabla de sesiones
	var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
	var b = [];
	for (var i = 0; i < length; i++) {
		var j = (Math.random() * (a.length - 1)).toFixed(0);
		b[i] = a[j];
	}
	return b.join("");
}

router.get("/usuarios", (req, res) => { //buscamos TODOS los usuarios
	const sqlSelect = "SELECT * FROM usuarios"
	db.query(sqlSelect, (err, result) => {
		if (err) {
			res.send(err)
		} else {
			res.send(result)
		}
	})
})

router.get("/usuarios/:id", (req, res) => {//LAS QUERIES QUE REQUIERAN UN CAMPO INSERTADO POR EL USUARIO HAY QUE DEFINIRLAS CON EL SIMBOLO ? PARA EVITAR SQL INJECTIONS

	const id = req.params.id

	const sqlSelect = "SELECT * FROM `usuarios` WHERE id_usuario = ?"
	db.query(sqlSelect, [id],(err, result) => {
		if (err) {
			res.send(sqlSelect + " " + id + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

//hay que revisar la funcion de login
router.post("/login", (req, res) => {//LAS QUERIES QUE REQUIERAN UN CAMPO INSERTADO POR EL USUARIO HAY QUE DEFINIRLAS CON EL SIMBOLO ? PARA EVITAR SQL INJECTIONS

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

//hay que revisar esta función
router.post("/checksession", (req, res) => {//LAS QUERIES QUE REQUIERAN UN CAMPO INSERTADO POR EL USUARIO HAY QUE DEFINIRLAS CON EL SIMBOLO ? PARA EVITAR SQL INJECTIONS

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

//hay que revisar la función
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