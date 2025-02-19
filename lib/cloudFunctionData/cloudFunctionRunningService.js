class cloudRunningService {
	constructor() {
		this.cloudFunctionRunning = {}
		this.cloudFunctionRunningCount = {}
	}

	endRunning(uuid) {
		this.cloudFunctionRunning[uuid] = false
		this.cloudFunctionRunningCount[uuid] -= 1
		// console.log('endRunning', uuid, this.cloudFunctionRunningCount[uuid])
	}

	startRunning(uuid) {
		// console.log('startRunning', uuid, this.cloudFunctionRunningCount[uuid])
		if (this.cloudFunctionRunning[uuid] === undefined) {
			this.cloudFunctionRunning[uuid] = false
			this.cloudFunctionRunningCount[uuid] = 0
		}
		if (this.cloudFunctionRunning[uuid] === true) {
			// console.log('startRunning - already running', uuid, this.cloudFunctionRunningCount[uuid])
			return false
		}
		this.cloudFunctionRunning[uuid] = true
		this.cloudFunctionRunningCount[uuid] += 1
		// console.log('startRunning - running', uuid, this.cloudFunctionRunningCount[uuid])
		return true
	}
}
module.exports = cloudRunningService