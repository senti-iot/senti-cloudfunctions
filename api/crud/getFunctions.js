
const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mysqlConn = require('../../mysql/mysql_handler')

const getFunctionsCIDQuery = `SELECT f.* FROM Functions f
			INNER JOIN Customer c ON c.id = f.customer_id
			WHERE c.ODEUM_org_id=? AND f.deleted=0`

const getFunctionsSUQuery = `SELECT f.*
							 FROM Functions f
							 WHERE f.deleted=0`

router.get('/:version/fs', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			await mysqlConn.query(getFunctionsSUQuery).then(rs => {
				res.status(200).json(rs[0])
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
router.get('/:version/fs/:customerID', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	let customerID = parseInt(req.params.customerID, 10)
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {

			await mysqlConn.query(getFunctionsCIDQuery, [customerID]).then(rs => {
				res.status(200).json(rs[0])
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
