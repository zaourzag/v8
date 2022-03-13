const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_LEVELROLES_DESCRIPTION'),
			runIn: ['text'],
			aliases: ['levelrole', 'lrole', 'lr'],
			usage: '<add|remove|show:default> [level:integer{1,}] [role:rolename]',
			usageDelim: ' '
		});

		this.requireSocial = true;
		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [action, level, role]) {
		const current = await msg.guild.settings.get('social.roles');
		const roles = await Promise.all(current.map(async rl => ({ level: rl.level, data: await msg.guild.roles.fetch(rl.id) })));

		let newRoles;

		if (action === 'show') return this.show(msg, roles);

		if (role.id === msg.guild.id) throw `COMMAND_LEVELROLES_CHEEKY`;

		switch (action) {
			case 'add':
				if (!role || !level) throw `COMMAND_LEVELROLES_ADD_MISSING`;
				newRoles = [...current, { level, id: role.id }];
				break;
			case 'remove':
				if (!role) throw `COMMAND_LEVELROLES_REMOVE_MISSING`;
				newRoles = [...current.filter(rl => rl.id !== role.id)];
				break;
		}

		msg.guild.settings.update('social.roles', newRoles, { arrayAction: 'overwrite' });

		return msg.responder.success(`COMMAND_LEVELROLES_${action.toUpperCase()}`, role, level);
	}

	show(msg, roles) {
		if (!roles.length) throw `COMMAND_LEVELROLES_NONE`;

		roles = roles.sort((a, b) => b.level - a.level);

		return msg.send([
			`**Levelroles currently configured in ${msg.guild.name}:**`,
			'',
			roles.map(role => `${role.level} → ${role.data}`)
		].join('\n'), { allowedMentions: { parse: [] } });
	}

};
