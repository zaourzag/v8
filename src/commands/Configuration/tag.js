/*
 * Co-Authored-By: Klasa Community Plugins (https://github.com/KlasaCommunityPlugins)
 * License: MIT License
 * 
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * 2019 Klasa Community Plugins (MIT License)
 * 2024 [mint](https://dsc.ng) @ [Aero](https://aero.bot)
 */

const { Command, util } = require('@aero/framework');
const { trimString } = require('../../../lib/util/util');
const { Util: djsUtil, Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_TAG_DESCRIPTION'),
			runIn: ['GUILD_TEXT'],
			subcommands: true,
			usage: '<add|remove|view|list:default> [tag:string] [content:string] [...]',
			usageDelim: ' ',
			aliases: ['t', 'tags']
		});

		this.defaultPermissions = FLAGS.MANAGE_MESSAGES;
	}

	async add(msg, [tag, ...content]) {
		if (!tag || !content.length) throw msg.language.get('COMMAND_TAG_EMPTY');
		if (msg.guild.settings.get('tags').find(tuple => tuple[0] === tag.toLowerCase())) throw msg.language.get('COMMAND_TAG_EXISTS');
		content = content.join(this.usageDelim);
		await msg.guild.settings.sync();
		await msg.guild.settings.update('tags', [...msg.guild.settings.get('tags'), [tag.toLowerCase(), content]], { arrayAction: 'overwrite' });
		return msg.send(msg.language.get('COMMAND_TAG_ADDED', tag, djsUtil.escapeMarkdown(content)));
	}

	async remove(msg, [tag]) {
		const tags = msg.guild.settings.get('tags');
		const filtered = tags.filter(([name]) => name !== tag.toLowerCase());
		if (tags.length === filtered.length) throw msg.language.get('COMMAND_TAG_NOEXIST', tag);
		await msg.guild.settings.sync();
		await msg.guild.settings.update('tags', filtered, { arrayAction: 'overwrite' });
		return msg.send(msg.language.get('COMMAND_TAG_REMOVED', tag));
	}

	view(msg, [tag]) {
		if (!tag) throw msg.language.get('COMMAND_TAG_UNSPECIFIED');
		const emote = msg.guild.settings.get('tags').find(([name]) => name === tag.toLowerCase());
		if (!emote) throw msg.language.get('COMMAND_TAG_NOEXIST', tag);
		return msg.send(util.codeBlock('', emote[1]));
	}

	list(msg) {
		if (!msg.guild.settings.get('tags').length) throw msg.language.get('COMMAND_TAG_NOTAGS', msg.guild.settings.get('prefix'));
		const tags = msg.guild.settings.get('tags');
		const output = [msg.language.get('COMMAND_TAG_LIST', msg.guild.name, tags.length), '```asciidoc'];
		for (const [index, [tag, value]] of tags.entries())
			output.push(`${index + 1}. ${tag} :: ${trimString(value, 30)}`);

		output.push('```');
		return msg.send(output.join('\n'));
	}

};
