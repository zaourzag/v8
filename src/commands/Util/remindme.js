const { Command, Duration } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: (language) => language.get('COMMAND_REMIND_DESCRIPTION'),
			usage: '<when:time> [text:...string]',
			usageDelim: ' ',
			aliases: ['remind', 'reminder']
		});
	}

	async run(msg, [time, text]) {
		const { id } = await this.client.schedule.create('reminder', time, {
			data: {
				channel: msg.channel.id,
				user: msg.author.id,
				message: msg.id,
				reference: msg.reference?.messageId,
				time: Math.floor(Date.now() / 1000),
				text
			}
		});

		return msg.responder.success(
			'COMMAND_REMIND_REPLY',
			Math.round(time.getTime() / 1000),
			id
		);
	}

};
