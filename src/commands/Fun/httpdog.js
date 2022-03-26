const { Command } = require('@aero/klasa');
const { MessageAttachment } = require('discord.js');
const req = require('@aero/http');
const BASE_URL = 'https://http.dog';

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_HTTPDOG_DESCRIPTION'),
			aliases: ['hdog'],
			usage: '<code:integer{100,600}>'
		});
	}

	async run(msg, [code]) {
		const res = await req(BASE_URL)
			.path(code.toString())
			.send();

		if (res.statusCode !== 200) throw 'COMMAND_HTTPDOG_INVALID';

		const img = new MessageAttachment(res.body, 'dog.jpg');

		return msg.send(img);
	}

};
