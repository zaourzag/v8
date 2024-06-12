/*
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * [Stitch07](https://github.com/Stitch07), [mint](https://dsc.ng) @ [Aero](https://aero.bot)
 */

const { Command } = require('@aero/framework');
const progress = require('../../../lib/util/progress');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PROFILE_DESCRIPTION'),
			usage: '[user:username]',
			aliases: ['lv', 'lvl', 'profile', 'progress']
		});

		this.requireSocial = true;
	}

	async run(msg, [user = msg.author]) {
		const member = await msg.guild.members.fetch(user.id);

		if (!member) return msg.responder.error('COMMAND_PROFILE_NOTMEMBER');
		await member.settings.sync(true);
		const points = member.settings.get('points');
		const level = member.settings.get('level');
		const nextLevel = this.client.monitors.get('points').xpNeeded(level + 1);

		msg.send([
			`\u200b  **level ${level}**  —  ${points} / ${nextLevel}`,
			`${progress(points, nextLevel)}`
		].join('\n'))
	}

};
