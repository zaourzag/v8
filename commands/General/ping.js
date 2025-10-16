const AeroCommand = require('../../lib/structures/AeroCommand');

class PingCommand extends AeroCommand {

	constructor(context, options) {
		super(context, {
			...options,
			name: 'ping',
			description: 'Shows bot latency'
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}

	async run(message) {
		const msg = await message.reply('Ping?');
		const wsPing = Math.round(this.container.client.ws.ping);
		const cfPing = 2;
		const roundTrip = (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp);

		const discordLatency = roundTrip - wsPing > 0 ? roundTrip - wsPing - cfPing : roundTrip - cfPing;
		const wsLatency = wsPing - cfPing;
		const netLatency = cfPing;

		const totalLatency = discordLatency + wsLatency + netLatency;

		return msg.edit(
			`Pong! 🏓\n` +
			`Total: **${totalLatency}ms**\n` +
			`Discord: **${discordLatency}ms**\n` +
			`WebSocket: **${wsLatency}ms**\n` +
			`Network: **${netLatency}ms**`
		);
	}

	async runSlash(interaction) {
		await interaction.deferReply();
		
		const wsPing = Math.round(this.container.client.ws.ping);
		const cfPing = 2;
		const roundTrip = Date.now() - interaction.createdTimestamp;

		const discordLatency = roundTrip - wsPing > 0 ? roundTrip - wsPing - cfPing : roundTrip - cfPing;
		const wsLatency = wsPing - cfPing;
		const netLatency = cfPing;

		const totalLatency = discordLatency + wsLatency + netLatency;

		return interaction.editReply(
			`Pong! 🏓\n` +
			`Total: **${totalLatency}ms**\n` +
			`Discord: **${discordLatency}ms**\n` +
			`WebSocket: **${wsLatency}ms**\n` +
			`Network: **${netLatency}ms**`
		);
	}

}

module.exports = PingCommand;
