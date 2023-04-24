const express = require('express');
const serverless = require('serverless-http');
const mysql = require('mysql')
const app = express();
const router = express.Router();

let records = [];

//Get all students
router.get('/', (req, res) => {
  res.send('App is running...');
});

//Create new record
router.post('/add', (req, res) => {
  res.send('New record added.');
});

//delete existing record
router.delete('/', (req, res) => {
  res.send('Deleted existing record');
});

//updating existing record
router.put('/', (req, res) => {
  res.send('Updating existing record');
});

//showing demo records
router.get('/demo', (req, res) => {
  res.json([
    {
      id: '001',
      name: 'Smith',
      email: 'smith@gmail.com',
    },
    {
      id: '002',
      name: 'Sam',
      email: 'sam@gmail.com',
    },
    {
      id: '003',
      name: 'lily',
      email: 'lily@gmail.coms',
    },
  ]);
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