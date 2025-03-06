/*
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * 
 * Credit-Example:
 * [Stitch07](https://github.com/Stitch07), [mint](https://ravy.dev/mint) @ [Aero](https://aero.bot)
 */

const { Inhibitor } = require('@aero/framework');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (message.guild && command.requireSocial && !message.guild.settings.get('social.enabled'))
			throw `The economy system isn't enabled in this server. Use \`${message.guild.settings.get('prefix')}social toggle\` to enable it.`;
	}

};
