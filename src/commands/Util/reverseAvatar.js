const { Command } = require('@aero/framework');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_REVERSEAVATAR_DESCRIPTION'),
			usage: '[user:username]',
			aliases: ['revav', 'rav']
		});
	}

	async run(msg, [user = msg.author]) {
		const embed = new MessageEmbed()
			.setDescription(`[Search ${user.username}'s Avatar](https://lens.google.com/uploadbyurl?url=${encodeURIComponent(user.displayAvatarURL({ format: 'png', size: 2048 }))})`);

		return msg.sendEmbed(embed);
	}

};
