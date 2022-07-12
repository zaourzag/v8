const ClientTiedCache = require('./ClientTiedCache');

module.exports = class InteractionRouter {

	constructor(client) {
		this.client = client;

		this.interactions = new ClientTiedCache(client, 60 * 60 * 1000);
	}

	subscribe(id, callback) {
		this.interactions.set(id, callback);
		return true;
	}

	unsubscribe(id) {
		return this.interactions.delete(id);
	}

	async run(id, ...args) {
		const callback = this.interactions.get(id);
		if (!callback) return false;
		else {
			await callback(...args);
			return true;
		}
	}

};
