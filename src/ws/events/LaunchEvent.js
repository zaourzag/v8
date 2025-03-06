/*
 * Co-Authored-By: rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * 
 * Credit-Example:
 * [rxsto](https://rxs.to), [mint](https://ravy.dev/mint) @ [Aero](https://aero.bot)
 */

const Event = require('../../../lib/ws/event/Event');
const { LAUNCH_CLIENT } = require('../../../lib/ws/util/constants').types;

class LaunchEvent extends Event {

	constructor(client) {
		super(client, LAUNCH_CLIENT);
	}

	run(data) {
		this.client.client.console.log('[Aether] Received launch event.');
		this.client.launch(data);
	}

}

module.exports = LaunchEvent;
