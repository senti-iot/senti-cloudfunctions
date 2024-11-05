class cloudRunningService {
	constructor() {
		this.cloudFunctionRunning = {}
	}

	async endRunning(uuid) {
		this.cloudFunctionRunning[uuid] = false
	}

	async startRunning(uuid) {
		if (this.cloudFunctionRunning[uuid] === undefined) {
			this.cloudFunctionRunning[uuid] = false
		}
		if (this.cloudFunctionRunning[uuid] === true) {
			return false
		}
		this.cloudFunctionRunning[uuid] = true
		return true
	}
}
module.exports = cloudRunningService