/*
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * [Stitch07](https://github.com/Stitch07), [mint](https://dsc.ng) @ [Aero](https://aero.bot)
 */

const { Command } = require('@aero/framework');
const req = require('@aero/http');
const { bold } = require('discord-md-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['yomama'],
			description: language => language.get('COMMAND_YOMAMMA_DESCRIPTION')
		});
		// this.deprecated = 'recurring SSL issues with the API.';
	}

	async run(msg) {
		const res = await req('https://api.yomomma.info').json();
		return msg.sendMessage(bold`📢 Yomomma joke: *${res.joke}*`);
	}

};
