/*
 * Co-Authored-By: rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * 
 * Credit-Example:
 * [rxsto](https://rxs.to), [mint](https://ravy.dev/mint) @ [Aero](https://aero.bot)
 */

const types = {

	IDENTIFY_CLIENT: 0,
	LAUNCH_CLIENT: 1,
	READY_CLIENT: 2,
	RECONNECT_CLIENT: 3

};

const states = {

	CONNECTING: 0,
	CONNECTED: 1,
	CLOSING: 2,
	CLOSED: 3,
	RECONNECTING: 4,
	IDLE: 5

};

module.exports = { types, states };
