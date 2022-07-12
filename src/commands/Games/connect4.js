const { Command } = require('@aero/framework');

const { error } = require('../../../lib/util/constants').reactions;


const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_C4_DESCRIPTION'),
			usage: '<opponent:username>',
			cooldown: 15,
			aliases: ['c4'],
			requiredPermissions: ['MANAGE_MESSAGES', 'ADD_REACTIONS']
		});

		this.channels = new Map();
	}


	async run(message, [user]) {
		const c4 = message.channel.connect4;
		if (this.channels.has(message.channel.id)) throw message.language.get('COMMAND_GAME_OCCURING');
		if (user.bot) throw message.language.get('COMMAND_GAME_NOBOTS');
		if (user === message.author) throw message.language.get('COMMAND_GAME_YOURSELF');
		const msg = await message.channel.send({
			content: message.language.get('COMMAND_GAME_CHALLENGE', user),
			components: [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`c4-accept-${message.channel.id}`)
							.setStyle('SUCCESS')
							.setLabel('Yes')
					)
					.addComponents(
						new MessageButton()
							.setCustomId(`c4-decline-${message.channel.id}`)
							.setStyle('DANGER')
							.setLabel('No')
					)
			]
		});

		const timeout = this.client.setTimeout(() => this.handleDecline(message, msg), 30 * 1000);

		this.client.router.subscribe(`c4-accept-${message.channel.id}`, (interaction) => {
			if (interaction.user.id !== user.id) return interaction.reply({ ephemeral: true, content: "The Maze isn't meant for you" });
			this.handleStart(c4, message, msg, user, interaction);
			this.client.clearTimeout(timeout);
		});

		this.client.router.subscribe(`c4-decline-${message.channel.id}`, (interaction) => {
			if (interaction.user.id !== user.id) return interaction.reply({ ephemeral: true, content: "The Maze isn't meant for you" });
			this.handleDecline(message, msg);
			this.client.clearTimeout(timeout);
			interaction.reply({ ephemeral: true, content: 'You declined the challenge.' });
		});
	}

	async handleProgress(msg, c4, action, interaction) {
		const { players, choice } = c4;
		const usr = players[choice % 2];

		const previousTimeout = this.channels.get(msg.channel.id);
		if (previousTimeout && previousTimeout !== true) this.client.clearTimeout(previousTimeout);

		if (action !== 'setup') {
			if (action === 'quit') {
				await interaction.update({ content: msg.language.get('COMMAND_C4_QUIT', await this.client.users.fetch(usr)), components: [] });
				c4.reset();
				this.channels.delete(msg.channel.id);
				this.removeListeners(msg);
				return null;
			}

			const column = action - 1;

			if (interaction.user.id !== usr) return interaction.reply({ content: "It's not your turn.", ephemeral: true });

			// if the column is full
			if (!c4.checkColumnPossible(column))
				return interaction.reply(msg.language.get('COMMAND_C4_COLLUMNFULL', usr));


			// if the selected move is possible
			c4.updateTable(usr, column);

			c4.choice += 1;

			const win = c4.check(usr);
			if (win) {
				const output = `${msg.language.get('COMMAND_C4_WIN', usr)}\n\n${c4.getTable()}`;
				// cleanup
				c4.reset();
				this.channels.delete(msg.channel.id);
				this.removeListeners(msg);
				return interaction.update({ content: output, components: [] });
			}
			// checking if no further move is possible
			const draw = c4.checkNoMove();
			if (draw) {
				const output = `${msg.language.get('COMMAND_C4_MAXMOVES')}\n${c4.getTable()}`;
				c4.reset();
				this.channels.delete(msg.channel.id);
				this.removeListeners(msg);
				return interaction.update({ content: output, components: [] });
			}
		}

		await interaction.update({ content: `${c4.turnTable()}\n1⃣2⃣3⃣4⃣5⃣6⃣7⃣`, components: [
			new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`c4-1-${msg.channel.id}`)
						.setStyle('PRIMARY')
						.setLabel('1')
				)
				.addComponents(
					new MessageButton()
						.setCustomId(`c4-2-${msg.channel.id}`)
						.setStyle('PRIMARY')
						.setLabel('2')
				)
				.addComponents(
					new MessageButton()
						.setCustomId(`c4-3-${msg.channel.id}`)
						.setStyle('PRIMARY')
						.setLabel('3')
				)
				.addComponents(
					new MessageButton()
						.setCustomId(`c4-4-${msg.channel.id}`)
						.setStyle('PRIMARY')
						.setLabel('4')
				),
			new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`c4-5-${msg.channel.id}`)
						.setStyle('PRIMARY')
						.setLabel('5')
				)
				.addComponents(
					new MessageButton()
						.setCustomId(`c4-6-${msg.channel.id}`)
						.setStyle('PRIMARY')
						.setLabel('6')
				)
				.addComponents(
					new MessageButton()
						.setCustomId(`c4-7-${msg.channel.id}`)
						.setStyle('PRIMARY')
						.setLabel('7')
				)
				.addComponents(
					new MessageButton()
						.setCustomId(`c4-quit-${msg.channel.id}`)
						.setStyle('DANGER')
						.setEmoji(error)
				)
		] });

		const timeout = this.client.setTimeout(() => {
			msg.edit({ content: `Time's up! <@${players[(choice + 1) % 2]}> loses after 30 seconds of inactivity.`, components: [] });
			c4.reset();
			this.channels.delete(msg.channel.id);
			this.removeListeners(msg);
		}, 30 * 1000);
		this.channels.set(msg.channel.id, timeout);
	}

	setupListeners(msg, c4) {
		this.client.router.subscribe(`c4-1-${msg.channel.id}`, (interaction) => this.handleProgress(msg, c4, 1, interaction));
		this.client.router.subscribe(`c4-2-${msg.channel.id}`, (interaction) => this.handleProgress(msg, c4, 2, interaction));
		this.client.router.subscribe(`c4-3-${msg.channel.id}`, (interaction) => this.handleProgress(msg, c4, 3, interaction));
		this.client.router.subscribe(`c4-4-${msg.channel.id}`, (interaction) => this.handleProgress(msg, c4, 4, interaction));
		this.client.router.subscribe(`c4-5-${msg.channel.id}`, (interaction) => this.handleProgress(msg, c4, 5, interaction));
		this.client.router.subscribe(`c4-6-${msg.channel.id}`, (interaction) => this.handleProgress(msg, c4, 6, interaction));
		this.client.router.subscribe(`c4-7-${msg.channel.id}`, (interaction) => this.handleProgress(msg, c4, 7, interaction));
		this.client.router.subscribe(`c4-quit-${msg.channel.id}`, (interaction) => this.handleProgress(msg, c4, 'quit', interaction));
	}

	removeListeners(msg) {
		this.client.router.unsubscribe(`c4-1-${msg.channel.id}`);
		this.client.router.unsubscribe(`c4-2-${msg.channel.id}`);
		this.client.router.unsubscribe(`c4-3-${msg.channel.id}`);
		this.client.router.unsubscribe(`c4-4-${msg.channel.id}`);
		this.client.router.unsubscribe(`c4-5-${msg.channel.id}`);
		this.client.router.unsubscribe(`c4-6-${msg.channel.id}`);
		this.client.router.unsubscribe(`c4-7-${msg.channel.id}`);
		this.client.router.unsubscribe(`c4-quit-${msg.channel.id}`);
	}

	handleStart(c4, message, msg, user, interaction) {
		if (this.channels.has(message.channel.id)) return interaction.reply('COMMAND_GAME_OCCURING');
		this.client.router.unsubscribe(`c4-accept-${message.channel.id}`);
		this.client.router.unsubscribe(`c4-decline-${message.channel.id}`);
		c4.startGame(message, user);
		this.channels.set(msg.channel.id, true);
		this.handleProgress(msg, c4, 'setup', interaction);
		this.setupListeners(msg, c4);
	}

	handleDecline(message, msg) {
		this.client.router.unsubscribe(`c4-accept-${message.channel.id}`);
		this.client.router.unsubscribe(`c4-decline-${message.channel.id}`);
		msg.edit({ content: message.language.get('COMMAND_GAME_DECLINED'), components: [] });
	}

};
