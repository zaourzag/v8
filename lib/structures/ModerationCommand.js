const { Command } = require('@aero/framework');

class ModerationCommand extends Command {

	comparePermissions(executor, target) {
		if (executor.guild.ownerId === executor.id) return executor.id !== target.id;
		return executor.roles.highest.position > target.roles.highest.position;
	}

	async logActions(guild, action, users, options) {
		if (users.length > 1)
			options.users = users;
		else
			[options.user] = users;

		await guild.log[action](options);
	}

}

module.exports = ModerationCommand;
