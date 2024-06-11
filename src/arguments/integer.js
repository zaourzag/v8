/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * License: MIT License
 * 
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * 2019 dirigeants (MIT License)
 * 2024 [mint](https://dsc.ng) @ [Aero](https://aero.bot)
 */

const { Argument } = require('@aero/framework');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['int'] });
	}

	run(arg, possible, message) {
		const { min, max } = possible;
		const number = parseInt(arg);
		if (!Number.isInteger(number)) throw message.language.get('RESOLVER_INVALID_INT', possible.name);
		return this.constructor.minOrMax(this.client, number, min, max, possible, message) ? number : null;
	}

};
