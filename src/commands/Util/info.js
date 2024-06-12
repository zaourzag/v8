const { Command, Duration, Timestamp } = require('@aero/framework');
const { GuildMember, MessageEmbed, User, Role, Permissions: { FLAGS } } = require('discord.js');
const {
	emojis: { perms: { granted, unspecified }, loading },
	badges,
	userInfo: { providers: providerMap }
} = require('../../../lib/util/constants');
const {
	verificationLevels,
	filterLevels
} = require('../../../lib/util/discord/guild');
const perms = require('../../../lib/util/discord/perms');
const req = require('@aero/http');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['user', 'role', 'i'],
			description: language => language.get('COMMAND_INFO_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'VIEW_AUDIT_LOG'],
			usage: '[server|member:membername|role:rolename|user:user|userID:str{17,18}]'
		});

		this.timestamp = new Timestamp('MMMM d YYYY');
	}

	async run(msg, [arg = msg.author]) {
		if (/^\d{17,18}$/.test(arg)) arg = await this.client.users.fetch(arg).catch(() => null);

		if ([
			...this.client.config.instances,
			this.client.user.id
		].includes(arg?.id ?? arg)) return this.bot(msg);
		if (arg instanceof User) return this.user(msg, arg);
		if (arg instanceof GuildMember) return this.user(msg, arg.user);
		if (arg instanceof Role) return this.role(msg, arg);
		if (msg.guild && [
			'server',
			msg.guild.id
		].includes(arg?.id ?? arg)) return this.server(msg);
		if (!arg) return msg.responder.error('COMMAND_INFO_INVALIDID');

		return false;
	}

	async user(msg, user) {
		const msgLoad = await msg.channel.send(`${loading} this might take a few seconds`);
		let embed = new MessageEmbed();

		const member = msg.guild ? await msg.guild.members.fetch(user).catch(() => null) : null;

		embed = await this._user_base(embed, msg, user);
		embed = await this._user_badges(embed, user);
		embed = await this._user_stats(embed, msg, user, member);
		embed = await this._user_member(embed, msg, member);
		embed = await this._user_security(embed, msg, user);

		await msg.sendEmbed(embed);
		return msgLoad.delete();
	}

	async _user_base(embed, msg, user) {
		let name, avatar;
		const proxy = msg.originalAuthor;

		if (msg.author.id === user.id && proxy) {
			// pluralkit
			name = `${proxy.name} (system of ${user.name} [${user.id}])`;
			avatar = (format) => proxy.displayAvatarURL({ dynamic: true, format });
		}
		else {
			// not pluralkit
			name = `${user.name} [${user.id}]`;
			avatar = (format) => user.displayAvatarURL({ dynamic: true, format });
		}

		const color = await req(this.client.config.colorgenURL)
			.path('dominant')
			.query('image', avatar("png"))
			.text();


		if (/^[0-9a-f]{6}$/i.test(color)) embed.setColor(color);

		return embed
			.setAuthor({
				name,
				iconURL: avatar("webp")
			})
	}

	async _user_badges(embed, user) {
		const userBadges = user.settings.get('badges')
			.toString(2)
			.split('')
			.reverse()
			.map((b, i) => b === '1' ? i : -1)
			.filter(i => i >= 0)
			.filter(i => badges[i])
			.map(i => badges[i]);

		if (!userBadges.length) return embed;

		return embed.setDescription(
			userBadges
				.map(badge => `${badge.icon} ${badge.title}`)
				.join('\n'));
	}

	async _user_stats(embed, msg, user, member) {
		const statistics = [];

		// user join
		const on = `on ${this.timestamp.display(user.createdAt)}`;
		const ago = `${Duration.toNow(user.createdAt)} ago`;

		statistics.push(`joined Discord ${on} (${ago})`);

		if (member) {
			// member join
			const created = (member.joinedTimestamp - msg.guild.createdTimestamp) < 3000;

			const { name } = msg.guild;
			const on = `on ${this.timestamp.display(member.joinedAt)}`;
			const ago = `${Duration.toNow(member.joinedAt)} ago`;

			statistics.push(`${created ? 'created' : 'joined'} ${name} ${on} (${ago})`);
		}

		const totalRep = user.settings.get('stats.reputation.total');
		if (totalRep) {
			// reputation
			const individualRep = user.settings.get('stats.reputation.individual').length;
			const upvoters = `${individualRep} individual upvoter${individualRep === 1 ? '' : 's'}`;

			statistics.push(`+${totalRep} rep (${upvoters})`);
		}

		return embed.addField('statistics', statistics.join('\n'));
	}

	async _user_member(embed, msg, member) {
		if (!member) return embed;

		const roles = member.roles.cache.sort((a, b) => b.position - a.position);
		if (roles.size > 1) {
			const groups = [...roles.values()]
				// no @everyone
				.filter(role => role.id !== msg.guild.id)
				// group by dividers
				.reduce((acc, { name }) => {
					if (name.startsWith('⎯⎯⎯'))
						acc.push([]);
					else
						acc[acc.length - 1].push(name);

					return acc;
				}, [[]])
				// remove empty groups
				.filter(roles => roles.length)
				// join each group together
				.map((roles) => [roles.join(', '), roles.length])
				// ensure 25 embed field limit
				.slice(0, 20);

			// if primary group > 1024 chars, we don't bother
			const [first, count] = groups.shift();
			if (first.length <= 1024) {
				let total = roles.size - 1;
				embed.addField(`role${total > 1 ? `s (${total})` : ''}`, first);

				// display groups as separate fields
				total -= count;
				for (const [roles, count] of groups) {
					if (roles.length <= 1024) {
						total -= count;
						embed.addField('\u200b', roles);
					}
					else {
						embed.addField('\u200b', `[${total} more]`);
						break;
					}
				}
			}
		}

		const warnings = member.settings.get('warnings');
		if (warnings.length) {
			await Promise.all(warnings
				.map(warning => warning.moderator)
				.map(moderator => this.client.users.fetch(moderator))
			);
			embed.addField(
				`warnings (${warnings.filter(warn => warn.active).length})`,
				warnings.map((warn, idx) => `${idx + 1}. ${!warn.active ? '~~' : ''}**${warn.reason}** | ${this.client.users.cache.get(warn.moderator).tag}${!warn.active ? '~~' : ''}`).join('\n')
			);
		}
		const notes = member.settings.get('notes');
		if (notes.length) {
			await Promise.all(notes
				.map(note => note.moderator)
				.map(moderator => this.client.users.fetch(moderator))
			);
			embed.addField(
				`notes (${notes.length})`,
				notes.map((note, idx) => `${idx + 1}. **${note.reason}** | ${this.client.users.cache.get(note.moderator).tag}`).join('\n')
			);
		}

		return embed;
	}

	async _user_security(embed, msg, user) {
		const { RAVY_TOKEN } = process.env;
		if (!RAVY_TOKEN) return embed;

		const { bans, whitelists, sentinel, rep } = await req('https://ravy.org/api/v1/')
			.path('/users')
			.path(user.id)
			.header('Authorization', RAVY_TOKEN)
			.json();

		const content = [
			...bans
				.map(({ reason, provider }) => ({
					reason: reason || 'unknown reason',
					provider: providerMap[provider] || provider
				}))
				.map(({ reason, provider }) => msg.language.get('COMMAND_INFO_USER_BANNED', provider, reason)),
			...whitelists
				.map(({ provider }) => providerMap[provider] || provider)
				.map(provider => msg.language.get('COMMAND_INFO_USER_WHITELISTED', provider)),
		];

		if (!content.length) content.push(
			...rep
				.map(({ score, provider }) => ({
					orientation: score > 0.5 ? 'positive' : score < 0.5 ? 'negative' : 'neutral',
					provider: providerMap[provider] || provider
				}))
				.map(({ orientation, provider }) =>
					msg.language.get(`COMMAND_INFO_USER_REP_${orientation.toUpperCase()}`, provider))
		)

		if (sentinel.verified)
			content.unshift(msg.language.get('COMMAND_INFO_USER_SENTINEL'));

		return embed.addField(`trust`, content.length
			? content.join('\n')
			: msg.language.get('COMMAND_INFO_USER_NEUTRAL'));;
	}

	role(msg, role) {
		const [bots, humans] = role.members.partition(member => member.user.bot);
		const embed = new MessageEmbed()
			.setTitle(`${role.name} [${role.id}]`)
			.setColor(role.color)
			.addField('color', role.color ? role.hexColor : 'none', true)
			.addField('members', `${humans.size} human${humans.size === 1 ? '' : 's'}, ${bots.size} bot${bots.size === 1 ? '' : 's'}`, true)
			.addField('permissions', role.permissions.has(FLAGS.ADMINISTRATOR)
				? 'Administrator (all permissions)'
				: Object.entries(role.permissions.serialize())
					.filter(perm => perm[1])
					.map(([perm]) => perms[perm])
					.join(', ') || 'none')
			.addField('created', `${this.timestamp.display(role.createdAt)} (${Duration.toNow(role.createdAt)} ago)`,)
			.addField('properties', [
				role.hoist
					? `${granted} displayed seperately`
					: `${unspecified} not displayed seperately`,
				role.mentionable
					? `${granted} mentionable as ${role.toString()}`
					: `${unspecified} not mentionable`,
				!role.managed
					? `${granted} configurable`
					: `${unspecified} managed by an integration`
			].join('\n'));
		return msg.sendEmbed(embed);
	}

	async server(msg) {
		const { guild } = msg;
		await msg.guild.members.fetch(msg.guild.ownerId);
		const owner = await guild.fetchOwner();
		const embed = new MessageEmbed()
			.setAuthor({ name: `${guild.name} [${guild.id}]`, iconURL: guild.iconURL() })
			.addField('created', `${this.timestamp.display(guild.createdAt)} (${Duration.toNow(guild.createdAt)} ago)`)
			.addField('members', `${guild.memberCount} (cached: ${guild.members.cache.size})`, true)
			.addField('owner', `${owner.user.tag} ${owner.toString()} [${owner.id}]`)
			.addField('security', [
				`Verification level: ${verificationLevels[msg.guild.verificationLevel]}`,
				`Explicit filter: ${filterLevels[msg.guild.explicitContentFilter]}`
			].join('\n'));
		const icon = msg.guild.iconURL({ format: 'png' });
		if (icon) embed.setColor(
			await req(this.client.config.colorgenURL)
				.path('dominant')
				.query('image', icon)
				.text());
		return msg.sendEmbed(embed);
	}

	async bot(msg) {
		const user = await this.client.users.fetch(this.client.config.instances[0]);
		const name = user.username;
		const avatar = user.displayAvatarURL({ dynamic: false });
		const text = [
			`${name} is a bot for intuitive community management.`,
			'',
			'It features 🛠 extensive moderation, 🎮 fun games, and a lot of other useful things.',
			`If you have a cool idea, feel free to share it on our [support server](${this.client.config.supportServer}) or directly [PR it](${this.client.config.repoURL}).`,
			'',
			`If you like what we're doing, please share ${name} with your pals!`,
			`Thank you for using ${name} ♥`
		].join('\n');

		if (msg.guild && !msg.guild.me.permissions.has(FLAGS.EMBED_LINKS)) return msg.send(text);

		const color = await req(this.client.config.colorgenURL)
			.path('dominant')
			.query('image', avatar)
			.text();

		return msg.sendEmbed(new MessageEmbed()
			.setAuthor({ name, iconURL: avatar })
			.setDescription(text)
			.setColor(color)
		);
	}

};
