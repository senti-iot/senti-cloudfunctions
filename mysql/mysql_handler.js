require('dotenv').load()
const mysql = require('mysql2');

const { DB_HOST, DB_USER, DATABASE, PASSWORD } = process.env

let connection = mysql.createPool({
	host: DB_HOST,
	user: DB_USER,
	password: PASSWORD,
	database: DATABASE,
	multipleStatements: true,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
})

connection = connection.promise()
// connection.connect((error) => {
// 	if (!error) 
// 		console.log('Database connection established')
// 	else
// 		console.log('Database connection failed \n Error : ' + JSON.stringify(error, undefined, 2))
// })

module.exports = connection