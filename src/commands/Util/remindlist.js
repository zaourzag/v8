/*
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * Co-Authored-By: Yhvr <yhvr@protonmail.com>
 *
 * Credit-Example:
 * [mint](https://ravy.dev/mint), Yhvr @ [Aero](https://aero.bot)
 */

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

		return msg.send(tasks
      .map(task => {
        const { data: { text, replyLink }, id, time } = task;

        const segments = [
          `\`[${id}]\``,
          `**${text.slice(0, 100)}${text.length > 100 ? '...' : ''}**`,
          replyLink,
          `(in ${Duration.toNow(time)})`
        ];

        return segments.filter(s => !!s).join(' ');
      })
      .join('\n')
    );
	}

};
