// Copyright (c) 2019 KlasaCommunityPlugins, MIT License
// derived from https://github.com/KlasaCommunityPlugins/tags
const { Command, util } = require('klasa');
const { trimString } = require('../../../lib/util/util');
const { util: djsUtil, Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_TAG_DESCRIPTION'),
			runIn: ['text'],
			subcommands: true,
			usage: '<add|remove|list|view> [tag:string] [content:string] [...]',
			usageDelim: ' ',
			aliases: ['t']
		});

		this.defaultPermissions = FLAGS.MANAGE_MESSAGES;
	}

	async add(msg, [tag, ...content]) {
		if (!tag || !content) throw msg.language.get('COMMAND_TAG_EMPTY');
		if (msg.guild.settings.get('tags').find(tuple => tuple[0] === tag.toLowerCase())) throw msg.language.get('COMMAND_TAG_EXISTS');
		content = content.join(this.usageDelim);
		await msg.guild.settings.sync();
		await msg.guild.settings.update('tags', [...msg.guild.settings.get('tags'), [tag.toLowerCase(), content]], { action: 'overwrite' });
		return msg.send(msg.language.get('COMMAND_TAG_ADDED', tag, djsUtil.escapeMarkdown(content)));
	}

	async remove(msg, [tag]) {
		const filtered = msg.guild.settings.get('tags').filter(([name]) => name !== tag.toLowerCase());
		await msg.guild.settings.sync();
		await msg.guild.settings.update('tags', filtered, { action: 'overwrite' });
		return msg.send(msg.language.get('COMMAND_TAG_REMOVED', tag));
	}

	view(msg, [tag = '']) {
		const emote = msg.guild.settings.get('tags').find(([name]) => name === tag.toLowerCase());
		if (!emote) throw msg.language.get('COMMAND_TAG_NOEXIST');
		return msg.send(util.codeBlock('', emote[1]));
	}

	list(msg) {
		if (!msg.guild.settings.get('tags').length) throw msg.language.get('COMMAND_TAG_NOTAGS');
		const tags = msg.guild.settings.get('tags');
		const output = [`**${msg.guild.name} Tags** (Total ${tags.length})`, '```asciidoc'];
		for (const [index, [tag, value]] of tags.entries()) {
			output.push(`${index + 1}. ${tag} :: ${trimString(value, 30)}`);
		}
		output.push('```');
		return msg.send(output.join('\n'));
	}

};
