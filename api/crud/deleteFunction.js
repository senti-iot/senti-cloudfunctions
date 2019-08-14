const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mysqlConn = require('../../mysql/mysql_handler')

const deleteFunctionQuery = `UPDATE Functions as f
			SET deleted=1
			WHERE f.id=?;
			`

router.post('/:version/delete-f/:id', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			let id = req.params.id
			mysqlConn.query(deleteFunctionQuery, [id]).then(rs => {
				console.log(rs[0].changedRows)
				if (rs[0].changedRows > 0) {
					res.status(200).json(true)
				}
				else {
					res.status(404).json(false)
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
