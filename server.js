#!/usr/bin/env nodejs
const dotenv = require('dotenv').load()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const pino = require('pino')
const app = express()
// var bodyParser = require('body-parser')

var methodOverride = require('method-override')



module.exports.logger = console

// const logger=pino(pino.destination(`/var/log/nodejs/cloudfunctions/${new Date().toLocaleDateString().replace(/\//g, '-')}.json`))
// module.exports.logger = pino(pino.extreme(`/var/log/nodejs/cloudfunctions/${new Date().toLocaleDateString().replace(/\//g, '-')}-others.json`))
// const expressPino = require('express-pino-logger')({
// 	logger: logger
// })
// app.use(expressPino)

// API endpoint imports

const port = process.env.NODE_PORT || 3011
app.use(helmet())
// app.use(bodyParser({ }))
// app.use(express.json())
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }))
app.use(cors())
app.use(methodOverride())

const functions = require('./api/functions/functions')
const createFunction = require('./api/crud/createFunction')
const getFunction = require('./api/crud/getFunction')
const getFunctions = require('./api/crud/getFunctions')
const updateFunction = require('./api/crud/updateFunction')
const deleteFunction = require('./api/crud/deleteFunction')
app.use([createFunction, updateFunction, getFunction, getFunctions, deleteFunction, functions])
app.use(function (err, req, res, next) {
	res.status(500).json(err)
})
//---Start the express server---------------------------------------------------

const startServer = () => {

	app.listen(port, () => {
		console.clear()
		console.log('Senti Cloud Functions server started on port', port)
		console.log(process.version)
	}).on('error', (err) => {
		if (err.errno === 'EADDRINUSE') {
			console.log('Server not started, port ' + port + ' is busy')
		} else {
			console.log(err)
		}
	})
}
try {
	startServer()
}
catch (e) {
	console.log(e)
}
