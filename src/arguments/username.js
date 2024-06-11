/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * License: MIT License
 * 
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * 2019 dirigeants (MIT License)
 * 2024 [mint](https://dsc.ng) @ [Aero](https://aero.bot)
 */

const { Argument, util: { regExpEsc } } = require('@aero/framework');
const { GuildMember, User } = require('discord.js');

const USER_REGEXP = Argument.regex.userOrMember;

function resolveUser(query, guild) {
	if (query instanceof GuildMember) return query.user;
	if (query instanceof User) return query;
	if (typeof query === 'string') {
		if (USER_REGEXP.test(query)) return guild.client.users.fetch(USER_REGEXP.exec(query)[1]).catch(() => null);
		if (/\w{1,32}#\d{4}/.test(query)) {
			const res = guild.members.cache.find(member => member.user.tag === query);
			return res ? res.user : null;
		}
	}
	return null;
}

module.exports = class extends Argument {

	async run(arg, possible, msg) {
		if (!arg) throw 'No user provided.';
		if (!msg.guild) return this.store.get('user').run(arg, possible, msg);
		const resUser = await resolveUser(arg, msg.guild);
		if (resUser) return resUser;

		const results = [];
		const reg = new RegExp(regExpEsc(arg), 'i');
		for (const member of msg.guild.members.cache.values())
			if (reg.test(member.user.username)) results.push(member.user);


		let querySearch;
		if (results.length > 0) {
			const regWord = new RegExp(`\\b${regExpEsc(arg)}\\b`, 'i');
			const filtered = results.filter(user => regWord.test(user.username));
			querySearch = filtered.length > 0 ? filtered : results;
		} else
			querySearch = results;


		if (querySearch.length) return querySearch[0];
		throw `\`${possible.name}\` must be a valid name, id or user mention`;
	}

};
