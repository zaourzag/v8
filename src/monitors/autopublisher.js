const { Monitor } = require('@aero/framework');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: false,
			ignoreSelf: false,
			ignoreEdits: false,
			ignoreOthers: false,
			ignoreWebhooks: false
		});
	}

	async run(msg) {
		if (!msg.guild || msg.channel?.type !== 'GUILD_NEWS' || !msg.crosspostable) return false;

		const possibles = msg.guild.settings.get('autopublish');

		if (!possibles.includes(msg.channel.id)) return false;

		return msg.crosspost();
	}

};
