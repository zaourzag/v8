/*
 * Co-Authored-By: Havish Pallerla <hey@havi.sh> (https://havi.sh)
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * 
 * Credit-Example:
 * [Havish Pallerla](https://havi.sh), [mint](https://ravy.dev/mint) @ [Aero](https://aero.bot)
 */

const { Command } = require('@aero/framework');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vcud', 'undeafen'],
			description: language => language.get('COMMAND_VOICEUNDEAFEN_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'DEAFEN_MEMBERS'],
			usage: '<user:membername> [reason:...string]',
			usageDelim: ' '
		});
	}
	async run(msg, [user, reason]) {
		if (!msg.member.permissions.has('DEAFEN_MEMBERS')) return msg.responder.error('COMMAND_VOICEUNDEAFEN_NOPERMS');
		if (!user.voice.channelId) return msg.responder.error('COMMAND_VOICEUNDEAFEN_NOVOICE');
		if (!user.voice.serverDeaf) return msg.responder.error('COMMAND_VOICEDEAFEN_ALREADY_UNDEAFENED');
		await user.voice.setDeaf(false, reason || msg.language.get('COMMAND_VOICEUNDEAFEN_NOREASON'));
		return msg.responder.success();
	}

};
