/*
 * Co-Authored-By: rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * [rxsto](https://rxs.to), [mint](https://dsc.ng) @ [Aero](https://aero.bot)
 */

class Event {

	constructor(client, name) {
		this.client = client;
		this.name = name;
	}

	run() {
		throw new SyntaxError('This should be overwritten in the actual event!');
	}

}

module.exports = Event;
