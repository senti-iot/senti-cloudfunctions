const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mysqlConn = require('../../mysql/mysql_handler')

router.post('/:version/f', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth

	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			let query = `UPDATE Functions as f
			INNER JOIN Customer c on c.ODEUM_org_id = ?
						SET f.name=?, 
			-- 			f.js=?, 
						f.description=?, 
						f.customer_id=c.id,
						\`type\`=?
			WHERE f.id=?;
			`
			let id = req.body.id
			let name = req.body.name
			let js = req.body.js
			let description = req.body.description
			let type = req.body.type
			let orgId = req.body.orgId
			mysqlConn.query(query, [orgId, name, js, description, type, id]).then(rs => {
				if (rs.insertId !== null || rs.insertId !== undefined) {
					res.status(200).json(rs[0].info)
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
