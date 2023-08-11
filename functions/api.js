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

router.get("/usuarios/clientes", (req, res) => { //buscamos los usuarios clientes
	const sqlSelect = "SELECT * FROM usuarios WHERE permisos = 0"
	db.query(sqlSelect, (err, result) => {
		if (err) {
			res.send(err)
		} else {
			res.send(result)
		}
	})
})

router.get("/usuarios/staff", (req, res) => { //buscamos los usuarios staff
	const sqlSelect = "SELECT * FROM usuarios WHERE permisos != 0"
	db.query(sqlSelect, (err, result) => {
		if (err) {
			res.send(err)
		} else {
			res.send(result)
		}
	})
})

router.get("/usuarios/coaches", (req, res) => { //buscamos los usuarios coach
	const sqlSelect = "SELECT * FROM usuarios WHERE permisos IN(2, 4)"
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

router.get("/cuentas=:id", (req, res) => { //buscamos TODAS las cuentas

	const id = req.params.id

	const sqlSelect = "SELECT * FROM cuentas WHERE id_usuario = ?"
	db.query(sqlSelect, [id], (err, result) => {
		if (err) {
			res.send(err)
		} else {
			res.send(result)
		}
	})
})

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

	const fecha = req.body.fecha
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

//!hay que revisar la función
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

router.get("/historial=:id", (req, res) => { //buscamos TODO el historial de una persona

	const id = req.params.id

	const sqlSelect = "SELECT * FROM historial WHERE id_cuenta = ?"
	db.query(sqlSelect, [id], (err, result) => {
		if (err) {
			res.send(sqlSelect + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.get("/historial/inicial=:id", (req, res) => { //buscamos el primer rango de una persona

	const id = req.params.id

	const sqlSelect = "SELECT * FROM `historial` WHERE id_cuenta = ? ORDER BY fecha ASC LIMIT 1"
	db.query(sqlSelect, [id], (err, result) => {
		if (err) {
			res.send(sqlSelect + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.get("/historial/actual=:id", (req, res) => { //buscamos el rango actual de una persona

	const id = req.params.id

	const sqlSelect = "SELECT * FROM `historial` WHERE id_cuenta = ? ORDER BY fecha DESC LIMIT 1"
	db.query(sqlSelect, [id], (err, result) => {
		if (err) {
			res.send(sqlSelect + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.get("/historial/maximo=:id", (req, res) => { //buscamos el historial maximo de una persona

	const id = req.params.id

	const sqlSelect = "SELECT * FROM historial WHERE id_cuenta = ? ORDER BY CASE WHEN division = 'CHALLENGER' then 1 WHEN division = 'GRANDMASTER' then 2 WHEN division = 'MASTER' then 3 WHEN division = 'DIAMOND' then 4 WHEN division = 'EMERALD' then 5 WHEN division = 'PLATINUM' then 6 WHEN division = 'GOLD' then 7 WHEN division = 'SILVER' then 8 WHEN division = 'BRONZE' then 9 WHEN division = 'IRON' then 10 END ASC, CASE WHEN rango = 'I' then 1 WHEN rango = 'II' then 2 WHEN rango = 'III' then 3 WHEN rango = 'IV' then 4 END ASC, lps DESC LIMIT 1"
	db.query(sqlSelect, [id], (err, result) => {
		if (err) {
			res.send(sqlSelect + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.get("/historial/id=:id&fecha=:fecha", (req, res) => { //buscamos el historial maximo de una persona

	const id = req.params.id
	const fecha = req.params.fecha

	const sqlSelect = "SELECT * FROM `historial` WHERE id_cuenta = ? AND fecha = ?"
	db.query(sqlSelect, [id, fecha], (err, result) => {
		if (err) {
			res.send(sqlSelect + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.get("/coaching/clase=:id", (req, res) => { //buscamos la clase por su id

	const id = req.params.id

	const sqlSelect = "SELECT coaching.*, usuarios.nombre FROM `coaching` INNER JOIN usuarios ON coaching.id_coach = usuarios.id_usuario WHERE coaching.id_sesion = ?"
	db.query(sqlSelect, [id], (err, result) => {
		if (err) {
			res.send(sqlSelect + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.get("/coaching/coach=:id", (req, res) => { //buscamos las clases de un coach

	const id = req.params.id

	const sqlSelect = "SELECT coaching.*, usuarios.nombre FROM `coaching` INNER JOIN usuarios ON coaching.id_coach = usuarios.id_usuario WHERE coaching.id_coach = ?"
	db.query(sqlSelect, [id], (err, result) => {
		if (err) {
			res.send(sqlSelect + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.get("/coaching/usuario=:id", (req, res) => { //buscamos las clases de un jugador

	const id = req.params.id

	const sqlSelect = "SELECT coaching.*, usuarios.nombre FROM `coaching` INNER JOIN usuarios ON coaching.id_coach = usuarios.id_usuario WHERE coaching.id_usuario = ?"
	db.query(sqlSelect, [id], (err, result) => {
		if (err) {
			res.send(sqlSelect + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.get("/coaching/pendientes/usuario=:id", (req, res) => { //buscamos las clases pendientes de un jugador

	const id = req.params.id

	const sqlSelect = "SELECT coaching.*, usuarios.nombre FROM `coaching` INNER JOIN usuarios ON coaching.id_coach = usuarios.id_usuario WHERE coaching.id_usuario = 2 AND fecha >= CURDATE() ORDER BY fecha ASC"
	db.query(sqlSelect, [id], (err, result) => {
		if (err) {
			res.send(sqlSelect + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.get("/coaching/completadas/usuario=:id", (req, res) => { //buscamos las clases completadas de un jugador

	const id = req.params.id

	const sqlSelect = "SELECT coaching.*, usuarios.nombre FROM `coaching` INNER JOIN usuarios ON coaching.id_coach = usuarios.id_usuario WHERE coaching.id_usuario = 2 AND fecha < CURDATE() AND hora < CURRENT_TIME() ORDER BY fecha DESC"
	db.query(sqlSelect, [id], (err, result) => {
		if (err) {
			res.send(sqlSelect + " error: " + err)
		} else {
			res.send(result)
		}
	})
})

router.post("/coaching/crear", (req, res) => {
	const idCliente = req.body.idCliente
	const idCoach = req.body.idCoach
	const fecha = req.body.fecha
	const hora = req.body.hora

	const sqlInsert = "INSERT INTO `coaching` (`id_sesion`, `id_usuario`, `id_coach`, `fecha`, `hora`) VALUES (NULL, ?, ?, ?, ?)"
	db.query(sqlInsert, [idCliente, idCoach, fecha, hora], (err, result) => {

		if (!err) {
			res.status(200)
			res.end("Successfully inserted - 200")
		} else {
			res.status(401)
			res.end(err)
		}
	})
})

//!funciones que se ejecutan automaticamente

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