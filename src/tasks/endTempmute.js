const { Task } = require('klasa');

module.exports = class extends Task {

	async run({ users, guild }) {
		guild = this.client.guilds.get(guild);
		if (!guild) return false;
		users.forEach(async user => {
			guild.modCache.add(user);
			const member = await guild.members.fetch(user);
			if (member) await member.unmute(guild.language.get('COMMAND_MUTE_TEMPMUTERELEASED'));
		});
		return users.length > 1
			? guild.log.tempmuteEnd({ users })
			: guild.log.tempmuteEnd({ user: users[0] });
	}

};
