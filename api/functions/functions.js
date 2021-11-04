const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mysqlConn = require('../../mysql/mysql_handler')

const cloudDataService = require('../../lib/cloudFunctionData/cloudFunctionDataService')
const sentiCloudData = new cloudDataService(mysqlConn)

router.post('/:version', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	let d = req.body
	// d.settings from eg. dataBroker will include { "device": ... } etc.
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			let nData = d.data
			let crash = false
			for (let i = 0; i < d.nIds.length; i++) {
				const n = d.nIds[i]
				let query = `SELECT uuid, js FROM cloudFunction WHERE id = ?`
				await mysqlConn.query(query, [n]).then(async rs => {
					// console.log(nData)
					// console.log(rs[0][0], n)
					try {
						let func = eval(rs[0][0].js)
						let settings = {
							cf: {
								"uuid": rs[0][0].uuid
							},
							...d.settings 
						}
						nData = await func(nData, settings)
						// console.log(nData)
					}
					catch (err) {
						console.log(err)
						let str = err.message.toString()
						crash = true
						console.log(str)
						console.log(n, nData)
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
