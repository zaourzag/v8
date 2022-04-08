const { Command } = require('@aero/framework');
const { Permissions: { FLAGS }, VoiceChannel } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['GUILD_TEXT'],
			requiredPermissions: ['MANAGE_CHANNELS'],
			aliases: ['l'],
			description: language => language.get('COMMAND_LOCK_DESCRIPTION'),
			usage: '[channel:channel]'
		});

		this.defaultPermissions = FLAGS.MANAGE_CHANNELS;
	}

	async run(msg, [channel = msg.channel]) {
		let override = {
			SEND_MESSAGES: false,
			ADD_REACTIONS: false
		};

		if (channel instanceof VoiceChannel) {
			override = {
				CONNECT: false
			};
		}

		await channel.permissionOverwrites.edit(
			msg.guild.id,
			override,
			msg.guild.language.get('COMMAND_LOCK_REASON')
		);


		return msg.responder.lock();
	}


};
