const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mysqlConn = require('../../mysql/mysql_handler')

router.put('/:version/add', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth

	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			let query = `INSERT INTO Functions
				(name, js, url, \`type\`)
				VALUES(?, ?, ?, ?)`
			let name = req.body.name
			let js = req.body.js
			let url = req.body.url
			let type = req.body.type
			mysqlConn.query(query, [name,js,url,type]).then(rs => {
				if (rs.insertId !== null || rs.insertId !== undefined) { 
					console.log(rs)
					res.status(200).json(rs[0].insertId)
				}

			}).catch(err => {
				console.log(err)
				res.status(500).json(err)
			})
		} else {
			res.status(403).json('Unauthorized Access! 403')
			console.log('Unauthorized Access!')
		}
	} else {
		console.log(`API version: ${apiVersion} not supported`)
		res.send(`API version: ${apiVersion} not supported`)
	}
})
module.exports = router
