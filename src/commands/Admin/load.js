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

const { Command, Stopwatch } = require('@aero/framework');
const { pathExists } = require('fs-nextra');
const { join } = require('path');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_LOAD_DESCRIPTION'),
			usage: '[core] <Store:store> <path:...string>',
			usageDelim: ' '
		});
		this.regExp = /\\\\?|\//g;
	}

	async run(message, [core, store, path]) {
		path = (path.endsWith('.js') ? path : `${path}.js`).split(this.regExp);
		const timer = new Stopwatch();
		const piece = await (core ? this.tryEach(store, path) : store.load(store.userDirectory, path));

		try {
			if (!piece) throw message.language.get('COMMAND_LOAD_FAIL');
			await piece.init();
			return message.sendLocale('COMMAND_LOAD', [timer.stop(), store.name, piece.name]);
		} catch (error) {
			timer.stop();
			throw message.language.get('COMMAND_LOAD_ERROR', store.name, piece ? piece.name : path.join('/'), error);
		}
	}

	async tryEach(store, path) {
		for (const dir of store.coreDirectories) if (await pathExists(join(dir, ...path))) return store.load(dir, path); /* eslint-disable-line no-await-in-loop */
		return undefined;
	}

};
