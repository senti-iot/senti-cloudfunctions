#!/usr/bin/env nodejs
const dotenv = require('dotenv').load()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const pino = require('pino')
const app = express()

// module.exports.logger = console

const logger=pino(pino.destination(`/var/log/nodejs/cloudfunctions/${new Date().toLocaleDateString().replace(/\//g, '-')}.json`))
module.exports.logger = pino(pino.extreme(`/var/log/nodejs/cloudfunctions/${new Date().toLocaleDateString().replace(/\//g, '-')}-others.json`))
const expressPino = require('express-pino-logger')({
	logger: logger
})
app.use(expressPino)

// API endpoint imports

const port = process.env.NODE_PORT || 3011

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

const functions = require('./api/functions/functions')
const createFunction = require('./api/crud/createFunction')
const updateFunction = require('./api/crud/updateFunction')
app.use('/',[functions, createFunction, updateFunction])

//---Start the express server---------------------------------------------------

const startServer = () => {
	app.listen(port, () => {
		console.log('Senti Cloud Functions server started on port', port)
	}).on('error', (err) => {
		if (err.errno === 'EADDRINUSE') {
			console.log('Server not started, port ' + port + ' is busy')
		} else {
			console.log(err)
		}
	})
}

startServer()
