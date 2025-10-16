/* eslint-disable no-bitwise, no-unused-vars */
const { GatewayIntentBits, Partials } = require('discord.js');

module.exports = {
	allowedMentions: { parse: ['users'] },
	restTimeOffset: 0,
	retryLimit: 2,
	partials: [Partials.Reaction, Partials.Message, Partials.Channel],
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent
	]
};
