class cloudDataService {
	constructor(db) {
		this.db = db
	}
    async getData(uuid) {
        let query = `SELECT data, version FROM cloudFunctionData WHERE uuid = ?`
        let rs = await this.db.query(query, uuid).catch(err => {
            console.log(err)
        })
        if (rs[0].length === 1) {
            return rs[0][0]
        }
        return { 
            data: {},
            version: 0
        }
    }
    async setData(uuid, saveData) {
        // Evt. getData og compare version
        let select = `REPLACE INTO cloudFunctionData(uuid, data) VALUES(?, ?)`
        let rs = await this.db.query(select, [uuid, JSON.stringify(saveData.data)]).catch(err => {
            console.log(err)
        })
        if (rs[0].affectedRows > 0) {
            return true
        }
        return false
    }
}
module.exports = cloudDataService