const { Command } = require('@aero/framework');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_YOINK_DESCRIPTION')
		});

		this.emojiRegex = /<(?<animated>a)?:(?<name>[\w-]+):(?<id>\d{17,19})>/g;
	}

	async run(message) {
		const msg = message.fetchReference();

		const emoji = [...msg.content.matchAll(this.emojiRegex)]
			.map(match => match.groups)
			.map(({ id, name, animated }) =>
				({
					name,
					url: `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}?size=256&quality=lossless`
				})
			);

		for (const { name, url } of emoji)
			message.guild.emojis.create(url, name);


		return message.responder.success();
	}

};
