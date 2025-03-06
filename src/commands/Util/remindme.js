const { Command, Duration } = require('@aero/framework');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_REMIND_DESCRIPTION'),
			usage: '<when:time> [text:...string]',
			usageDelim: ' ',
			aliases: ['remind', 'reminder']
		});
	}

	async run(msg, [time, text]) {
		const reminderData = {
			channel: msg.channel.id,
			user: msg.author.id,
			text: text ?? msg.language.get("COMMAND_REMIND_FALLBACK"),
		}

		if (msg.reference !== null) {
			reminderData.replyLink = `https://discord.com/channels/${msg.reference.guildId}/${msg.reference.channelId}/${msg.reference.messageId}`;
		}

		const { id } = await this.client.schedule.create('reminder', time, {
			data: reminderData
		});
		return msg.responder.success('COMMAND_REMIND_REPLY', Duration.toNow(time), id);
	}

};
