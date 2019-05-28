const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mysqlConn = require('../../mysql/mysql_handler')

router.post('/:version', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	let d = req.body
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			let nData = d.data
			for (let i = 0; i < d.nIds.length; i++) {
				let f = 0
				const n = d.nIds[i]
				let query = `SELECT js from Functions where id=?`
				await mysqlConn.query(query, [n]).then(rs => {
					// console.log(rs[0][0], n)
					let func = eval(rs[0][0].js)
					nData = func(nData)
				}).catch(err => {
					f = 1
					console.log(err)
					res.status(500).json(err)
				})
				if (f === 1) {
					break
				}
			}
			res.status(200).json(nData)
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
