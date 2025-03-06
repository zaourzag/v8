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

const { Command } = require('@aero/framework');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_UNLOAD_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	async run(message, [piece]) {
		if ((piece.type === 'event' && piece.name === 'message') || (piece.type === 'monitor' && piece.name === 'commandHandler'))
			return message.sendLocale('COMMAND_UNLOAD_WARN');

		piece.unload();
		return message.sendLocale('COMMAND_UNLOAD', [piece.type, piece.name]);
	}

};
