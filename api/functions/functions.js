const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mysqlConn = require('../../mysql/mysql_handler')

router.post('/:version', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth

	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
				let query = `SELECT js from Functions where id=?`
				mysqlConn.query(query, [req.body.nId]).then(rs=> {
					let func = eval(rs[0][0].js)
					let data = req.body.data
					console.log(func(data))
					res.status(200).json(func(data))

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
