/*
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Co-Authored-By: mint <mint@aero.bot> (https://ravy.dev/mint)
 * 
 * Credit-Example:
 * [Stitch07](https://github.com/Stitch07), [mint](https://ravy.dev/mint) @ [Aero](https://aero.bot)
 */

const { Command } = require('@aero/framework');
const req = require('@aero/http');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['dadjoke'],
			description: language => language.get('COMMAND_PUN_DESCRIPTION')
		});
	}

	async run(msg) {
		const res = await req('https://icanhazdadjoke.com')
			.header('Accept', 'application/json')
			.json()
			.catch(() => { throw msg.language.get('COMMAND_PUN_APIDOWN'); });
		return msg.sendMessage(msg.language.get('COMMAND_PUN_REPLY', res.joke));
	}

};
