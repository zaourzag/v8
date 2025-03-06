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

const { Argument } = require('@aero/framework');

const { emoji: regex } = require('../../lib/util/constants').regexes;

module.exports = class extends Argument {

	run(arg, possible, message) {
		if (regex.test(arg)) return regex.exec(arg)[0];
		throw message.language.get('RESOLVER_INVALID_EMOJI', possible.name);
	}

};
