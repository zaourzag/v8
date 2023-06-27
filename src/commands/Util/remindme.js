const { Command, Duration } = require('@aero/framework');

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
		this.client.schedule.tasks.filter(task =>
			task.taskName === 'reminder'
			&& task.data.message === msg.id
		).forEach(task => this.client.schedule.delete(task.id));

		const { id } = await this.client.schedule.create('reminder', time, {
			data: {
				channel: msg.channel.id,
				user: msg.author.id,
				message: msg.id,
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
