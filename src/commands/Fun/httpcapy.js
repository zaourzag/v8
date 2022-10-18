const { Command } = require('@aero/framework');
const req = require('@aero/http');
const BASE_URL = 'https://http.capy.pics';

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_HTTPCAPY_DESCRIPTION'),
			aliases: ['hcapy'],
			usage: '<code:integer{100,600}>'
		});
	}

	async run(msg, [code]) {
		const res = await req(BASE_URL)
			.path(code.toString())
			.send();

		if (res.statusCode !== 200) throw 'COMMAND_HTTPCAPY_INVALID';

		return msg.channel.sendFile(res.body, 'capy.jpg');
	}

};
