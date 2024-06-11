const Command = require('../../../../lib/structures/MultiModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');
const { dateDiffDays } = require('../../../../lib/util/util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['GUILD_TEXT'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['m', 'silence', '403', 'timeout'],
			description: language => language.get('COMMAND_MUTE_DESCRIPTION'),
			usage: '<user  or  users:members> [duration:time] [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [users, duration, reason]) {
		const muteable = await this.getModeratable(msg.member, users, true);
		if (!muteable.length) return msg.responder.error('COMMAND_MUTE_NOPERMS', users.length > 1);

		await this.executeMutes(muteable, reason, msg.guild, msg.author, duration);
		await this.logActions(msg.guild, duration ? 'tempmute' : 'mute', muteable.map(member => member.user), { reason, moderator: msg.author, duration, msg });

		return msg.responder.success();
	}

	async executeMutes(users, reason, guild, moderator, duration) {
		const formattedReason = `${moderator.tag} | ${reason || guild.language.get('COMMAND_MUTE_NOREASON')}`;
		for (const member of users) {
			guild.modCache.add(member.id);
			if (duration && dateDiffDays(new Date(), duration) <= 28) member.mute(formattedReason, duration);
			else throw 'COMMAND_MUTE_ERR_DURATION';

			if (!duration) this.updateSchedule(member);
		}
	}

};
