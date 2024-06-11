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

const { Inhibitor } = require('@aero/framework');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			spamProtection: true
		});
	}

	async run(message, command) {
		if (this.client.options.owners.includes(message.author.id) || this.client.config.ownerAccess.includes(message.author.id)) return;
		// secure admin commands, all others don't need permissionLevels
		if (command.permissionLevel >= 9) throw true;
		// permission nodes don't work in DMs. the runIn inhibitor will deal with them.
		if (!message.guild) return;
		// only in guilds owned by a bot owner
		if (command.permissionLevel >= 7 && !this.client.options.owners.includes(message?.guild.ownerId)) throw true;
		// only in small guilds or ones owned by a bot owner
		if (command.permissionLevel >= 6 && message?.guild.memberCount > 100 && !this.client.options.owners.includes(message?.guild.ownerId)) throw true;
		const check = await this.client.permissions.canUse(message, command);
		if (!check) {
			await message.responder.error('INHIBITOR_PERM_NODES', `${command.category.toLowerCase()}.${command.name}`);
			throw true;
		}
	}

};
