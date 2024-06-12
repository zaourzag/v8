const { Command, util } = require('@aero/framework');
const req = require('@aero/http');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: language => language.get('COMMAND_MASSFETCH_DESCRIPTION'),
			usage: '<hastebin:string>',
			guarded: true
		});

		this.regex = /https:\/\/(?:hst\.sh|haste\.aero\.bot)\/(?:raw\/)?(\w+)/i;
	}

	async run(msg, [url]) {
		const key = this.regex.exec(url)[1];

		if (!key) throw 'Invalid hastebin url';

		const res = await req(this.client.config.hasteURL)
			.path('raw')
			.path(key)
			.text();

		const ids = res.split('\n').filter(id => id.length <= 19 && id.length >= 17);

		if (ids.length === 0) throw 'No valid ids found';

		const users = await Promise.all(ids.map(id => this.client.users.fetch(id)));

		return msg.send(util.codeBlock('', users.map(user => user.tag).join('\n')));
	}

};
