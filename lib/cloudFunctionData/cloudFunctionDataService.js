class cloudDataService {
	constructor(db) {
		this.db = db
	}
    async getData(uuid1, uuid2) {
        let query = `SELECT data FROM cloudFunctionData WHERE uuid1 = ? AND uuid2 = ?`
        let rs = await this.db.query(query, [uuid1, uuid2]).catch(err => {
            console.log(err)
        })
        if (rs[0].length === 1) {
            return rs[0][0].data
        }
        return {}
    }
    async setData(uuid1, uuid2, saveData) {
        let select = `REPLACE INTO cloudFunctionData(uuid1, uuid2, data, modified) VALUES(?, ?, ?, NOW())`
        let rs = await this.db.query(select, [uuid1, uuid2, JSON.stringify(saveData)]).catch(err => {
            console.log(err)
        })
        if (rs[0].affectedRows > 0) {
            return true
        }
        return false
    }
}
module.exports = cloudDataService