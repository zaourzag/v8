const { Command } = require('@aero/framework');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_ICON_DESCRIPTION')
		});
	}

	async run(msg) {
		const embed = new MessageEmbed()
			.setAuthor({ name: msg.guild.name, iconURL: msg.guild.iconURL() })
			.setImage(msg.guild.iconURL({ size: 2048, dynamic: true }))
			.setDescription([
				[
					`[png](${msg.guild.iconURL({ size: 2048, format: 'png' })})`,
					`[jpg](${msg.guild.iconURL({ size: 2048, format: 'jpg' })})`,
					`[webp](${msg.guild.iconURL({ size: 2048, format: 'webp' })})`
				].join(' | '),
				[
					`[16](${msg.guild.iconURL({ size: 16, dynamic: true })})`,
					`[32](${msg.guild.iconURL({ size: 32, dynamic: true })})`,
					`[64](${msg.guild.iconURL({ size: 64, dynamic: true })})`,
					`[128](${msg.guild.iconURL({ size: 128, dynamic: true })})`,
					`[256](${msg.guild.iconURL({ size: 256, dynamic: true })})`,
					`[512](${msg.guild.iconURL({ size: 512, dynamic: true })})`,
					`[1024](${msg.guild.iconURL({ size: 1024, dynamic: true })})`,
					`[2048](${msg.guild.iconURL({ size: 2048, dynamic: true })})`
				].join(' | ')
			].join('\n'));

		return msg.sendEmbed(embed);
	}

};
