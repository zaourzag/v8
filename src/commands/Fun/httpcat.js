const { Command } = require('@aero/framework');
const req = require('@aero/http');
const BASE_URL = 'https://http.cat';

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_HTTPCAT_DESCRIPTION'),
			aliases: ['hcat', 'http'],
			usage: '<code:integer{100,600}>'
		});
	}

	async run(msg, [code]) {
		const res = await req(BASE_URL)
			.path(code.toString())
			.send();

		if (res.statusCode !== 200) throw 'COMMAND_HTTPCAT_INVALID';

		return msg.channel.sendFile(res.body, 'cat.jpg');
	}

};
