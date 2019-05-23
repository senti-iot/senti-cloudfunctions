const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mysqlConn = require('../../mysql/mysql_handler')

router.get('/:version/f/:id', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	let funcID = req.params.id
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			let query = `SELECT * from Functions where id=?`
			await mysqlConn.query(query, [funcID]).then(rs => {
				if (rs[0][0])
				{
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
// router.get('/:version/f/:id', async (req, res, next) => {
// 	let apiVersion = req.params.version
// 	let authToken = req.headers.auth
// 	// let customerID = req.params.customerID
// 	let funcID = parseInt(req.params.id, 10)
// 	if (verifyAPIVersion(apiVersion)) {
// 		if (authenticate(authToken)) {
// 			let query = `SELECT f.* from Functions f
// 			where f.id = ?`
// 			await mysqlConn.query(query, [funcID]).then(rs => {
// 				console.log(rs[0][0])
// 				if (rs[0][0])
// 				{
// 					res.status(200).json(rs[0][0])
// 				}
// 				else {
// 					res.status(404).json(false)
// 				}
// 			}).catch(err => {
// 				if (err) { res.status(500).json(err) }
// 			})
// 		} else {
// 			res.status(403).json('Unauthorized Access! 403')
// 			console.log('Unauthorized Access!')
// 		}
// 	} else {
// 		console.log(`API/sigfox version: ${apiVersion} not supported`)
// 		res.send(`API/sigfox version: ${apiVersion} not supported`)
// 	}
// })
module.exports = router
