const { Command } = require('@aero/framework');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['GUILD_TEXT'],
			description: language => language.get('COMMAND_HEURISTICS_DESCRIPTION'),
			usage: '<enable|disable>'
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [input]) {
		const enabled = input === 'enable';
		await msg.guild.settings.sync();
		await msg.guild.settings.update('mod.heuristics', enabled);
		return msg.responder.success(`COMMAND_HEURISTICS_${input.toUpperCase()}`);
	}

};
