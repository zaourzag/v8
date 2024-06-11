/*
 * Co-Authored-By: Havish Pallerla <hey@havi.sh> (https://havi.sh)
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * [Havish Pallerla](https://havi.sh), [mint](https://dsc.ng) @ [Aero](https://aero.bot)
 */

const { Command } = require('@aero/framework');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vck'],
			description: language => language.get('COMMAND_VOICEKICK_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'MOVE_MEMBERS', 'MANAGE_CHANNELS'],
			usage: '<user:membername>'
		});
	}
	async run(msg, [user]) {
		if (!msg.member.permissions.has('MOVE_MEMBERS')) return msg.responder.error('COMMAND_VOICEKICK_NOPERMS');
		if (!user.voice.channelId) return msg.responder.error('COMMAND_VOICEKICK_NOVOICE');
		await user.voice.disconnect();
		return msg.responder.success();
	}

};
