const { Event } = require('@aero/framework');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(channel) {
		if (channel.partial || !channel.guild || !(channel.type === 'GUILD_TEXT')) return;
		const id = channel.guild.settings.get('mod.roles.mute');
		channel.initMute(id);
	}

};
