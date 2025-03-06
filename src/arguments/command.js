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

	constructor(...args) {
		super(...args, { aliases: ['cmd'] });
	}

	async run(arg, possible, message) {
		const command = this.client.commands.get(arg.toLowerCase());
		if (command && await message.hasAtLeastPermissionLevel(command.permissionLevel)) return command;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'command');
	}

};
