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

	run(arg, possible, message) {
		// if (regex.test(arg)) return regex.exec(arg)[0];
		// throw message.language.get('RESOLVER_INVALID_EMOJI', possible.name);

		let url;

		try {
			url = new URL(arg);
		} catch {
			try {
				url = new URL(arg.replace(/<(.*?)>/, '$1'));
			} catch {
				throw message.language.get('RESOLVER_INVALID_URL', possible.name);
			}
		}

		if (!['https:', 'http:'].includes(url.protocol)) throw message.language.get('RESOLVER_URL_BADPROTO', possible.name);

		if (url.username?.length || url.password?.length) throw message.language.get('RESOLVER_URL_NOAUTH', possible.name);

		return url.href;
	}

};
