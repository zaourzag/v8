/*
 * Co-Authored-By: rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * [rxsto](https://rxs.to), [mint](https://dsc.ng) @ [Aero](https://aero.bot)
 */

const Message = require('../Message');

class MessageUtil {

	static encode(message) {
		return JSON.stringify(message);
	}

	static decode(message) {
		const parsed = JSON.parse(message);
		return new Message(parsed.t, parsed.d);
	}

}

module.exports = MessageUtil;
