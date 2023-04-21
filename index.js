const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))
// const JWT = require('jsonwebtoken')
// const secretWord = 'Samus#Aran'

const credentials = {
	host: '212.227.32.40',
	user: 'root',
	password: '8m!25i!17I',
	database: 'bellum'
}

app.get('/', (req, res) => {
	res.send('hola desde tu primera rutda de la Api')
})

app.get('/api/login', (req, res) => {
	console.log("hey")
	const { username, password } = req.body
	//const values = [username, password]
	var connection = mysql.createConnection(credentials)
	connection.query("SELECT * FROM contacto", (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.send(result)
		}
	})
	connection.end()
})


app.listen(3001, () => console.log('hola soy el servidor'))