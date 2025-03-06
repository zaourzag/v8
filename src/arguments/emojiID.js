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

module.exports = class extends Argument {

	run(arg, possible, message) {
		const emoji = this.constructor.regex.emoji.test(arg) && this.constructor.regex.emoji.exec(arg)[1];
		if (emoji) return emoji;
		throw message.language.get('RESOLVER_INVALID_EMOJI', possible.name);
	}

};
