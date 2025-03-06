/*
 * Co-Authored-By: rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * 
 * Credit-Example:
 * [rxsto](https://rxs.to), [mint](https://ravy.dev/mint) @ [Aero](https://aero.bot)
 */

const EventStore = require('./EventStore');
const MessageUtil = require('../util/MessageUtil');

class EventHandler {

	constructor(client) {
		this.client = client;
		this.store = new EventStore(client);
	}

	init() {
		this.store.init();
	}

	handle(message) {
		const decoded = MessageUtil.decode(message);
		const event = this.store.get(decoded.type);

		if (event === null)
			throw new TypeError(`Event type "${decoded.type}" not found!`);


		event.run(decoded.data);
	}

}

module.exports = EventHandler;
