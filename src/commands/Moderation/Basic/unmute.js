const Command = require('../../../../lib/structures/MultiModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['GUILD_TEXT'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['um', 'release', 'untimeout', 'cleartimeout', 'removetimeout'],
			description: language => language.get('COMMAND_UNMUTE_DESCRIPTION'),
			usage: '<user  or  users:members> [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [users, reason]) {
		const muteable = await this.getModeratable(msg.member, users, true);
		if (!muteable.length) return msg.responder.error('COMMAND_UNMUTE_NOPERMS', users.length > 1);

		await this.executeUnmutes(muteable, reason, msg.guild, msg.author);
		await this.logActions(msg.guild, 'unmute', muteable.map(member => member.user), { reason, moderator: msg.author, msg });

		return msg.responder.success();
	}

	async executeUnmutes(users, reason, guild, moderator) {
		for (const member of users) {
			guild.modCache.add(member.id);
			await member.unmute(`${moderator.tag} | ${reason || guild.language.get('COMMAND_UNMUTE_NOREASON')}`);
		}
	}

};
