/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */
const { Task } = require('@aero/framework');

module.exports = class extends Task {

	async run({ channel: channelId, user, message, text }) {
		if (!channelId || !user) return false;

		const channel = this.client.channels.cache.get(channelId);
		if (!channel) return false;

		return channel.send({
			content: `You wanted me to remind you: ${text ?? '...'}`,
			allowedMentions: {
				repliedUser: true,
				parse: ['users']
			},
			reply: {
				failIfNotExists: false,
				messageReference: message
			}
		});
	}

};
