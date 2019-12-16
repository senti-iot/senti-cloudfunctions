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
			let crash = false
			for (let i = 0; i < d.nIds.length; i++) {
				const n = d.nIds[i]
				let query = `SELECT js from Functions where id=?`
				await mysqlConn.query(query, [n]).then(rs => {
					// console.log(nData)
					// console.log(rs[0][0], n)
					try {
						let func = eval(rs[0][0].js)
						nData = func(nData)
						console.log(nData)
					}
					catch (err) {
						console.log(err)
						let str = err.message.toString()
						crash = true
						console.log(str)
						next(str)
					}
				}).catch(err => {
					crash = true
					next(err)
				})
			}
			if (!crash)
				res.status(200).json(nData)
			// if (!crashed)
			// 	res.status(200).json(nData)
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
