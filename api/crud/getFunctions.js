
const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mysqlConn = require('../../mysql/mysql_handler')


router.get('/:version/fs', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			let query = `select f.* from Functions f`
			await mysqlConn.query(query).then(rs => {
					res.status(200).json(rs[0])
				}).catch(err => {
					if(err) {res.status(500).json(err)}
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
	console.log(req.params.customerID)
	let customerID = parseInt(req.params.customerID,10)
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			let query = `select f.* from Functions f
			inner join Customer c on c.id = f.customer_id
			where c.ODEUM_org_id=?`
			await mysqlConn.query(query,[customerID]).then(rs => {
					res.status(200).json(rs[0])
				}).catch(err => {
					if(err) {res.status(500).json(err)}
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
