const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mysqlConn = require('../../mysql/mysql_handler')

const getFunctionQuery = `SELECT f.*, o.id as orgId from cloudFunction f
	INNER JOIN organisation o on o.id = f.orgId
	WHERE f.id=? AND f.deleted=0`

router.get('/:version/f/:id', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			let funcID = req.params.id
			await mysqlConn.query(getFunctionQuery, [funcID]).then(rs => {
				if (rs[0][0]) {
					res.status(200).json(rs[0][0])
				}
				else {
					res.status(404).json(false)
				}
			}).catch(err => {
				if (err) { res.status(500).json(err) }
			})
		} else {
			res.status(403).json('Unauthorized Access! 403')
			console.log('Unauthorized Access!')
		}
	} else {
		console.log(`API/sigfox version: ${apiVersion} not supported`)
		res.send(`API/sigfox version: ${apiVersion} not supported`)
	}
})

module.exports = router
