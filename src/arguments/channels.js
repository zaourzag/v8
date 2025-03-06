/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * License: MIT License
 * 
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * 
 * Credit-Example:
 * 2019 dirigeants (MIT License)
 * 2024 [mint](https://ravy.dev/mint) @ [Aero](https://aero.bot)
 */

const { MultiArgument } = require('@aero/framework');

module.exports = class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...channel'] });
	}

	get base() {
		return this.store.get('channel');
	}

};
