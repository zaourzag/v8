const { Command } = require('@aero/framework');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/http');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['blahaj', 'shark'],
			bucket: 2,
			cooldown: 5,
			description: 'Get a random picture of a blahaj'
		});
	}

	async run(msg) {
        const blahaj = await req('https://blahaj.shop/api/random/json').json()
		return msg.sendEmbed(new MessageEmbed()
			.setImage(blahaj.source)
            .setFooter(`powered by blahaj.shop - ${blahaj.uuid}`)
		);
	}

};
