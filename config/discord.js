/* eslint-disable no-bitwise, no-unused-vars */
const { GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS, GUILD_VOICE_STATES } = require('discord.js').Intents.FLAGS;

module.exports = {
	allowedMentions: { parse: ['users'] },
	restTimeOffset: 0,
	retryLimit: 2,
	partials: ['REACTION', 'MESSAGE', 'CHANNEL'],
	intents: [GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS, GUILD_VOICE_STATES]
};
