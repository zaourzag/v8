const { Command } = require('@aero/framework');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/http');
const { join } = require('path').posix;
const BASE_URL = 'https://en.wikipedia.org/';
const BASE_PATH = '/api/rest_v1/page/summary';

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_WIKI_DESCRIPTION'),
			usage: '<term:str>'
		});
	}

	async run(msg, [term]) {
		// this code is here because undici incorrectly follows relative location headers
		const req1 = req(BASE_URL)
			.path(BASE_PATH, term)
			.follow(false);

		const res1 = await req1.send();
		let res;

		if (res1.statusCode > 299 && res1.statusCode < 400) {
			const res2 = await req(BASE_URL)
				.path(join(BASE_PATH, res1.headers.location))
				.json()
				.catch(() => { throw 'COMMAND_WIKI_NOTFOUND'; });

			res = res2;
		}
		else
			res = await res1.body.json();


		if (res.type !== 'standard') throw 'COMMAND_WIKI_NOTFOUND';

		return msg.send([
			`**${res.title}** — Wikipedia`,
			'',
			`${res.extract}`,
			'',
			`<${res.content_urls.desktop.page}>`
		].join('\n'));
	}

};
