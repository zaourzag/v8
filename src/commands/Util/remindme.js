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
			description: language => language.get('COMMAND_REMIND_DESCRIPTION'),
			usage: '<when:time> [text:...string]',
			usageDelim: ' ',
			aliases: ['remind', 'reminder']
		});
	}

	async run(msg, [time, text]) {
		const data = {
			channel: msg.channel.id,
			user: msg.author.id,
			text: text ?? msg.language.get("COMMAND_REMIND_FALLBACK"),
      replyLink: msg.reference && replyLink(msg)
		}

		const { id } = await this.client.schedule.create('reminder', time, { data });
		return msg.responder.success('COMMAND_REMIND_REPLY', Duration.toNow(time), id);
	}

  replyLink(msg) {
    const { guildId, channelId, messageId } = msg.reference;
		return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
  }

};
