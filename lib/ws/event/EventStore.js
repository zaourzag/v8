/*
 * Co-Authored-By: rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * [rxsto](https://rxs.to), [mint](https://dsc.ng) @ [Aero](https://aero.bot)
 */

const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

class EventStore extends Collection {

	constructor(client) {
		super();
		this.client = client;
	}

	init() {
		const events = readdirSync(join(process.cwd(), '/src/ws/events'));
		for (const event of events) {
			const Event = require(join(process.cwd(), '/src/ws/events/', event));
			const instance = new Event(this.client);
			this.set(instance.name, instance);
		}
	}

}

module.exports = EventStore;
