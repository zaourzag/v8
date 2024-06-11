const { Command } = require('@aero/framework');
const req = require('@aero/http');
const { loading } = require('../util/constants').emojis;

module.exports = class LGBTImageCommand extends Command {


	constructor(name, ...args) {
		const options = args.pop();

		super(...args, {
			description: language => language.get(`COMMAND_${name.toUpperCase()}_DESCRIPTION`),
			usage: '[user:username]',
			...options
		});

		this.name = name;
	}

	async run(msg, [user = msg.author]) {
		let avatar;
		if (msg.flagArgs.guild) {
			const member = await msg.guild.members.fetch(user);
			if (member.customAvatar)
				avatar = member.customAvatarURL({ size: 1024, format: 'png' });
			else
				avatar = user.displayAvatarURL({ size: 1024, format: 'png' });
		}
		else if (msg.flagArgs.proxy && user.id === msg.author.id && msg.originalAuthor)
			avatar = msg.originalAuthor.displayAvatarURL({ size: 1024, format: 'png' });
		else
			avatar = user.displayAvatarURL({ size: 1024, format: 'png' });

		const msgLoad = await msg.channel.send(`${loading} this might take a few seconds`);

		const img = await req('https://api.pfp.lgbt/v5/image/static/')
			.path(msg.flagArgs.overlay ? 'overlay' : 'circle')
			.path(msg.flagArgs.solid ? 'solid' : 'gradient')
			.path(`${this.name}.png`)
			.post()
			.body({ file: await req(avatar).blob() }, 'multipart')
			.raw();

		await msg.channel.sendFile(img, 'avatar.png');

		return msgLoad.delete();
	}

};
