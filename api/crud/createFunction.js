const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mysqlConn = require('../../mysql/mysql_handler')

router.put('/:version/f', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth

	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			let query = `INSERT INTO Functions (name, js, description, \`type\`, customer_id)
			SELECT ?, ?, ?, ?, c.id from Customer c 
			where c.ODEUM_org_id = ?`
			let name = req.body.name
			let js = req.body.js
			let description = req.body.description
			let type = req.body.type
			let ODEUMid = req.body.orgId
			mysqlConn.query(query, [name,js,description,type, ODEUMid]).then(rs => {
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
