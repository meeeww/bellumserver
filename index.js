const express = require('express')
const app = express()

let users = [
	{
		id: 1,
		nombre: "Juan"
	}
]

app.get("/", (req, res) => {
	res.send("deployado")
})

app.get("/api/users", (req, res) => {
	res.json(users)
})

app.listen(process.env.PORT || 3001, () => {
	console.log("escuchando")
})