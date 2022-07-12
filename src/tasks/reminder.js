/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */
const { Task } = require('@aero/framework');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Task {

	async run({ channel: channelId, user, message, reference, text, time }) {
		if (!channelId || !user) return false;

		const channel = this.client.channels.cache.get(channelId);
		if (!channel) return false;

		return channel.send({
			content: reference
				? !text
					? `<@${user}>, you wanted me to remind you about this <t:${time}:R>.`
					: `<@${user}>, you wanted me to remind you <t:${time}:R>: ${text ?? '...'}`
				: `You wanted me to remind you: ${text ?? '...'}`,
			allowedMentions: {
				repliedUser: !reference,
				parse: ['users']
			},
			reply: {
				failIfNotExists: false,
				// if the reminder was in a reply to another message, reply to that (if it exists)
				// instead of the remindme command's invocation
				messageReference: reference ?? message
			},
			components: reference ? [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setStyle('LINK')
							.setLabel('Jump to command')
							.setURL(`https://discord.com/channels/${channel.guild?.id ?? '@me'}/${channel.id}/${message}`)
					)
			] : undefined
		});
	}

};
