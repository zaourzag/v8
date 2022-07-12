module.exports = class ClientTiedCache {

	constructor(client, ttl) {
		this.client = client;
		this.ttl = ttl;
		this._values = new Map();
	}

	get(key) {
		const tuple = this._values.get(key);
		if (!tuple) return null;
		else return tuple[1];
	}

	set(key, value) {
		const existing = this._values.get(key);
		if (existing) {
			const [timeout] = existing;

			this.client.clearTimeout(timeout);
		}

		const timeout = this.client.setTimeout(() => this._values.delete(key), this.ttl);
		this._values.set(key, [timeout, value]);
	}

	delete(key) {
		const tuple = this._values.get(key);
		if (!tuple) return false;
		else {
			const [timeout] = tuple;
			this.client.clearTimeout(timeout);
			this._values.delete(key);
			return true;
		}
	}

};
