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
			aliases: ['vcm'],
			description: language => language.get('COMMAND_VOICEMUTE_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'MUTE_MEMBERS'],
			usage: '<user:membername> [reason:...string]',
			usageDelim: ' '
		});
	}
	async run(msg, [user, reason]) {
		if (!msg.member.permissions.has('MUTE_MEMBERS')) return msg.responder.error('COMMAND_VOICEMUTE_NOPERMS');
		if (!user.voice.channelId) return msg.responder.error('COMMAND_VOICEMUTE_NOVOICE');
		if (user.voice.serverMute) return msg.responder.error('COMMAND_VOICEMUTE_ALREADY_MUTED');
		await user.voice.setMute(true, reason || msg.language.get('COMMAND_VOICEMUTE_NOREASON'));
		return msg.responder.success();
	}

};
