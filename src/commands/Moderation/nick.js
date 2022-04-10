const Command = require('../../../lib/structures/ModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['GUILD_TEXT'],
			requiredPermissions: ['MANAGE_NICKNAMES'],
			description: language => language.get('COMMAND_NICK_DESCRIPTION'),
			usage: '<member:member> [name:string{1,50}]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_NICKNAMES;
	}

	async run(msg, [member, name]) {
		if (!this.comparePermissions(msg.member, member)) return msg.responder.error('COMMAND_NICK_NOPERMS');
		return await member.setNickname(name || null)
			.catch((err) => (msg.responder.error('COMMAND_NICK_ERROR', err), true))
			.then(err => err || msg.responder.success());
	}


};
