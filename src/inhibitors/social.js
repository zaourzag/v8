/*
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * [Stitch07](https://github.com/Stitch07), [mint](https://dsc.ng) @ [Aero](https://aero.bot)
 */

const { Inhibitor } = require('@aero/framework');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (message.guild && command.requireSocial && !message.guild.settings.get('social.enabled'))
			throw `The economy system isn't enabled in this server. Use \`${message.guild.settings.get('prefix')}social toggle\` to enable it.`;
	}

};
