const { Command, Duration } = require('@aero/framework');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_REMINDLIST_DESCRIPTION'),
			usage: '',
			usageDelim: ' ',
			aliases: ['reminders', 'reminderlist']
		});
	}

	async run(msg) {
		const tasks = this.client.schedule.tasks
			.filter(task => task.taskName === 'reminder' && task.data.user === msg.author.id);

		if (!tasks.length) return msg.responder.info('COMMAND_REMINDLIST_NOREMINDERS');

		return msg.send(tasks.map(task => `\`[${task.id}]\` **${task.data.text ? task.data.text.length > 100 ? `${task.data.text.slice(0, 100)}...` : task.data.text : '(no text)'}** (<t:${Math.floor(task.time.getTime() / 1000)}:R>)`).join('\n'));
	}

};
