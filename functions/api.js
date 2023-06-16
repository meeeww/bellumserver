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

router.get("/usuarios/id=:id", (req, res) => {//LAS QUERIES QUE REQUIERAN UN CAMPO INSERTADO POR EL USUARIO HAY QUE DEFINIRLAS CON EL SIMBOLO ? PARA EVITAR SQL INJECTIONS

	const id = req.params.id

	const sqlSelect = "SELECT * FROM `usuarios` WHERE id_usuario = ?"
	db.query(sqlSelect, [id], (err, result) => {
		if (err) {
			res.send(sqlSelect + " " + id + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.get("/usuarios/nombre=:nombre", (req, res) => {//LAS QUERIES QUE REQUIERAN UN CAMPO INSERTADO POR EL USUARIO HAY QUE DEFINIRLAS CON EL SIMBOLO ? PARA EVITAR SQL INJECTIONS

	const nombre = req.params.nombre

	const sqlSelect = "SELECT * FROM `usuarios` WHERE nombre = ?"
	db.query(sqlSelect, [nombre], (err, result) => {
		if (err) {
			res.send(sqlSelect + " " + nombre + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.get("/cuentas", (req, res) => { //buscamos TODAS las cuentas
	const sqlSelect = "SELECT * FROM cuentas"
	db.query(sqlSelect, (err, result) => {
		if (err) {
			res.send(err)
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

	const sqlSelect = "SELECT * FROM `usuarios` WHERE nombre = ? AND contra = ?"
	db.query(sqlSelect, [nombreInicio, contrasenaInicio], (err, result) => {
		if (err) {
			res.send("error")//res.send(sqlSelect + " " + nombreInicio + " " + contrasenaInicio + " error")
		} else {
			const idUsuario = result[0]["id_usuario"]

			const sqlSelect = "INSERT INTO `sesiones` (`id_usuario`, `primera_sesion`, `ultima_sesion`, `dispositivo`, `token`) VALUES ('" + idUsuario + "', '" + fecha + "', '" + fecha + "', '" + agente + "', '" + token + "')"
			db.query(sqlSelect, [idUsuario, fecha, fecha, agente, token], (err, result) => {
				if (err) {
					res.send("error2")//res.send(sqlSelect + " " + nombreInicio + " " + contrasenaInicio + " error2")
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

router.put("/updatesession", (req, res) => {
	const token = req.body.token

	const sqlSelect = "UPDATE sesiones SET ultima_sesion = ? WHERE token = ?"
	db.query(sqlSelect, [fecha, token], (err, result) => {
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

	//console.log(nombreContacto, apellidoContacto, correoContacto, asuntoContacto, mensajeContacto)

	const sqlInsert = "INSERT INTO `contacto` (`id_contacto`, `nombre`, `apellido`, `email`, `asunto`, `mensaje`) VALUES (NULL, ?, ?, ?, ?, ?);"
	db.query(sqlInsert, [nombreContacto, apellidoContacto, correoContacto, asuntoContacto, mensajeContacto], (err, result) => {
		res.status(200)
		res.end("Successfully inserted - 200")
	})
})

router.get("/historial", (req, res) => { //buscamos TODO el historial
	const sqlSelect = "SELECT * FROM historial"
	db.query(sqlSelect, (err, result) => {
		if (err) {
			res.send(err)
		} else {
			res.send(result)
		}
	})
})

router.post("/actualizarrango", (req, res) => {
	const idCuenta = req.body.idCuenta
	const division = req.body.division
	const rango = req.body.rango
	const lps = req.body.lps
	const fecha = req.body.fecha

	const sqlInsert = "INSERT INTO `historial` (`id_cuenta`, `division`, `rango`, `lps`, `fecha`) VALUES (?, ?, ?, ?, ?)"
	db.query(sqlInsert, [idCuenta, division, rango, lps, fecha], (err, result) => {
		res.status(200)
		res.end("Successfully inserted - 200")
	})
})

/*funciones que se ejecutan automaticamente*/

router.delete("/fixrango", (req, res) => {
	const sqlQuery = "DELETE S1 FROM historial AS S1 INNER JOIN historial AS S2 WHERE S1.id_cuenta = S2.id_cuenta AND S1.fecha = S2.fecha AND S1.id_historial > S2.id_historial"
	db.query(sqlQuery, (err, result) => {
		res.status(200)
		res.end("Successfully inserted - 200")
	})
})

router.put("/cambiarnombreinvocador", (req, res) => {
	const id = req.body.idCuenta
	const nombre = req.body.invocador

	const sqlUpdate = "UPDATE `cuentas` SET `invocador` = ? WHERE `cuentas`.`id_cuenta` = ?"
	db.query(sqlUpdate, [nombre, id], (err, result) => {
		res.status(200)
		res.end("Successfully updated " + nombre + " with ID " + id)
	})
})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);