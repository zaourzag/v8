const { BaseCluster } = require('kurasuta');

module.exports = class extends BaseCluster {

	launch() {
		this.client.logger.info(`[Kurasuta] Launching cluster ${this.id}.`);
		this.client.login();
	}

};
