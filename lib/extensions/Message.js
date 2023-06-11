/*
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Credit example: Credit goes to [ravy](https://ravy.pink) and [Stitch07](https://github.com/Stitch07). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Structures } = require('discord.js');
const Responder = require('../Responder');
const { ownerAccess } = require('../../config/aero');
const { MessageFlags, PermissionFlagsBits } = require('discord-api-types/v10');
const PK_ID = '466378653216014359';

Structures.extend('Message', Message => {
	class AeroMessage extends Message {

		constructor(client, data, channel) {
			super(client, data, channel);
			this.responder = new Responder(this);
			this.invite = null;
			this.originalAuthor = null;
			this.pk = data?.application_id && data.application_id === PK_ID;
		}

		get exempt() {
			if (ownerAccess.includes(this.author.id)) return true;
			if ([...this.client.owners].map(owner => owner.id).includes(this.author.id)) return true;
			if (!this.guild) return false;
			if (this?.member?.permissions.has('ADMINISTRATOR')) return true;
			if (this.guild.settings.get('mod.ignored.users').includes(this.author.id)) return true;
			if (this.guild.settings.get('mod.ignored.channels').includes(this.channel.id)) return true;
			const ignoredRoles = this.guild.settings.get('mod.ignored.roles');
			if (!this.member) return false;
			for (const role of this.member.roles.cache.keys())
				if (ignoredRoles.includes(role)) return true;

			return false;
		}

		// porting Message.crosspostable to our (old) discord.js version / klasa fork
		// https://github.com/discordjs/discord.js/blob/6c2242f4f970b1c75c243f74ae64f30ecbf8ba0d/packages/discord.js/src/structures/Message.js#L698-L710
		// https://discord.com/channels/367759499613962240/583055343177695232/1058758241741451344
		// https://discord.com/channels/803423136669368340/803432976049242121/1117540817750462565
		get crosspostable() {
			// we don't have PermissionsBitField yet, constants taken from
			// https://github.com/discordjs/discord.js/blob/6c2242f4f970b1c75c243f74ae64f30ecbf8ba0d/packages/discord.js/src/util/PermissionsBitField.js#LL48C22-L48C33
			const bitfield
			// eslint-disable-next-line no-bitwise
				= PermissionFlagsBits.SendMessages
				| (this.author.id === this.client.user.id ? BigInt(0) : PermissionFlagsBits.ManageMessages);
			const { channel } = this;
			return Boolean(
				channel?.type === 'GUILD_NEWS'
				&& !this.flags.has(MessageFlags.Crossposted)
				&& this.type === 'DEFAULT'
				&& channel.permissionsFor(this.guild.members.cache.get(this.client.user.id))?.has(bitfield, false)
			);
			// the original implementation checked channel.viewable, which we don't have either.
			// since the bot will only see the message if it can see the channel, that check was redundant anyway.
		}

	}
	return AeroMessage;
});
