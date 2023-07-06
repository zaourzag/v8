const { Monitor } = require('@aero/framework');
const util = require('../../lib/util/util');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: true,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('social.enabled') || !msg.guild.me.permissions.has(['SEND_MESSAGES']) || !msg.member) return;
		// cache
		const key = `${msg.guild.id}.${msg.author.id}`;
		if (this.cache.has(key)) return;
		this.cache.add(key);
		setTimeout(() => this.cache.delete(key), 45 * 1000);

		// get current xp
		const currentLevel = msg.member.settings.get("level");
		const currentXP = msg.member.settings.get("points");

		// generate new xp
		const increment = util.random(3, 8);
		const newXP = msg.member.settings.get('points') + increment;
		const newLevel = msg.member.settings.get('level') + 1;
		const xpNeeded = this.xpNeeded(newLevel);

		await msg.member.settings.sync();

		// ensure user has initial level role
		if (currentLevel === 1 && currentXP === 0)
			await this.levelRoles(msg.member, currentLevel);

		if (newXP >= xpNeeded) {
			await msg.member.settings.update([['points', newXP - xpNeeded], ['level', newLevel]]);
			await this.levelRoles(msg.member, newLevel);
			if (msg.guild.settings.get('social.levelupMessages')) {
				await msg.channel.send(util.randomArray(msg.language.get('LEVEL_MESSAGES'))
					.replace(/{level}/g, newLevel).replace(/{user}/g, msg.author.username));
			}
		} else
			await msg.member.settings.update('points', newXP);
	}

	xpNeeded(level) {
		/*
		 * Fancy curve; makes intervals of 5 levels in which the exp slowly increase, then a big jump.
		 * https://www.desmos.com/calculator/e9vblu1gwf
		 * https://i.imgur.com/4geGBzs.png
		 */
		/* eslint-disable no-mixed-operators */
		/* eslint-disable id-length */
		const f = x => 100 + Math.min(Math.max(0, 2 * (10 * (((x - 5) / 10 - Math.floor(1 / 2 + (x - 5) / 10)) ** 2) + 10 * Math.floor(x / 10) + x - 2.5)), 2000);
		return Math.ceil(f(level));
	}

	async levelRoles(member, newLevel) {
		const roles = await member.guild.settings.get('social.roles');
		if (!roles.length) return;

		const ids = await roles.filter(role => role.level <= newLevel).map(role => role.id);

		const newRoles = await ids.filter(id => !member.roles.cache.has(id));

		member.addRoles(newRoles);
	}

	async init() {
		this.cache = new Set();
	}

};
