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
			aliases: ['vcum', 'letsay', 'letspeak'],
			description: language => language.get('COMMAND_VOICEUNMUTE_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'MUTE_MEMBERS'],
			usage: '<user:membername> [reason:...string]',
			usageDelim: ' '
		});
	}
	async run(msg, [user, reason]) {
		if (!msg.member.permissions.has('MUTE_MEMBERS')) return msg.responder.error('COMMAND_VOICEUNMUTE_NOPERMS');
		if (!user.voice.channelId) return msg.responder.error('COMMAND_VOICEUNMUTE_NOVOICE');
		if (!user.voice.serverMute) return msg.responder.error('COMMAND_VOICEMUTE_ALREADY_UNMUTED');
		await user.voice.setMute(false, reason || msg.language.get('COMMAND_VOICEUNMUTE_NOREASON'));
		return msg.responder.success();
	}

};
