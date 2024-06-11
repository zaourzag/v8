const COLOR = {
	MOCHA: {
		RED: 'f38ba8',
		PEACH: 'fab387',
		YELLOW: 'f9e2af',
		GREEN: 'a6e3a1',
		BLUE: '89b4fa',
	},
};

const ICON = {
	BADGE: {
		W21: '<:badge_w21:952070507786797087>',
	},
	CAW: {
		OUT: {
			CHECK: '<:caw_out_check:1248365537713590382>',
			LIKE: '<:caw_out_like:1248365444264624160>',
			EDIT: '<:caw_out_edit:1248365543505924127>',
			STAR: '<:caw_out_star:1248365544969867314>',
		},
		DUO: {
			CHECK: '<:caw_duo_check:1248359557030219806>',
			LIKE: '<:caw_duo_like:1248359620221861948>',
			EDIT: '<:caw_duo_edit:1248359616262180904>',
			STAR: '<:caw_duo_star:1248359802065780866>',
			BOLT: '<:caw_duo_bolt:1248359554983399464>',
			PAUSE: '<:caw_duo_pause:1248373909888303164>',
			PLAY: '<:caw_duo_play:1248373911398387764>',
		},
		SSM: {
			CHECK: '<:caw_ssm_check:1248359299701407774>',
			NO: '<:caw_ssm_no:1248359315862065224>',
			DOT: '<:caw_ssm_dot:1248359303191068702>',
			PLUS: '<:caw_ssm_plus:1248359386192150558>',
			MINUS: '<:caw_ssm_minus:1248359384925339710>',
			EXCLAM: '<:caw_ssm_exclam:1248359305543942174>',
			QUESTION: '<:caw_ssm_question:1248359318881833061>',
		},
	}
};

const re = (customEmoji) => customEmoji.replace(/^<a?:(.+)>$/, "$1");

/* eslint-disable no-bitwise */
module.exports = {
	emojis: {
		success: ICON.CAW.SSM.CHECK,
		error: ICON.CAW.SSM.NO,
		yes: ICON.CAW.SSM.CHECK,
		no: ICON.CAW.SSM.NO,
		loading: ICON.CAW.SSM.DOT,
		plus: ICON.CAW.SSM.PLUS,
		minus: ICON.CAW.SSM.MINUS,
		trusted: ICON.CAW.SSM.CHECK,
		banned: ICON.CAW.SSM.EXCLAM,
		nodata: ICON.CAW.SSM.QUESTION,
		perms: {
			granted: ICON.CAW.SSM.CHECK,
			unspecified: ICON.CAW.SSM.DOT,
			denied: ICON.CAW.SSM.NO,
		},
		covid: {
			cases: ICON.CAW.SSM.EXCLAM,
			deaths: ICON.CAW.SSM.NO,
			recoveries: ICON.CAW.SSM.CHECK,
			tests: ICON.CAW.SSM.QUESTION,
		},
	},

	reactions: {
		success: re(ICON.CAW.SSM.CHECK),
		error: re(ICON.CAW.SSM.NO),
		yes: re(ICON.CAW.SSM.CHECK),
		no: re(ICON.CAW.SSM.NO),
		loading: re(ICON.CAW.SSM.DOT),
		lock: re(ICON.CAW.DUO.PAUSE),
		unlock: re(ICON.CAW.DUO.PLAY),
		plus: re(ICON.CAW.SSM.PLUS),
		minus: re(ICON.CAW.SSM.MINUS),
		fallbackYes: '✅',
		fallbackNo: '❌'
	},

	poll: {
		1: '1️⃣',
		2: '2️⃣',
		3: '3️⃣',
		4: '4️⃣',
		5: '5️⃣',
		6: '6️⃣',
		7: '7️⃣',
		8: '8️⃣',
		9: '9️⃣',
		10: '🔟'
	},

	color: {
		VERY_NEGATIVE: COLOR.MOCHA.RED,
		NEGATIVE: COLOR.MOCHA.PEACH,
		SLIGHTLY_NEGATIVE: COLOR.MOCHA.YELLOW,
		POSITIVE: COLOR.MOCHA.GREEN,
		INFORMATION: COLOR.MOCHA.BLUE,
	},

	log: {
		// mod actions
		ban: {
			type: 'moderation',
			icon: 'https://cdn.discordapp.com/emojis/1248359796462194761.png',
			color: 'VERY_NEGATIVE'
		},
		unban: {
			type: 'moderation',
			icon: '',
			color: 'POSITIVE'
		},
		tempban: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		tempbanEnd: {
			type: 'moderation',
			icon: '',
			color: 'INFORMATION'
		},
		softban: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		globalBan: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		globalUnban: {
			type: 'moderation',
			icon: '',
			color: 'POSITIVE'
		},
		bulkBan: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		kick: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		mute: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		unmute: {
			type: 'moderation',
			icon: '',
			color: 'POSITIVE'
		},
		tempmute: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		tempmuteEnd: {
			type: 'moderation',
			icon: '',
			color: 'INFORMATION'
		},
		warn: {
			type: 'moderation',
			icon: '',
			color: 'NEGATIVE'
		},
		unwarn: {
			type: 'moderation',
			icon: '',
			color: 'POSITIVE'
		},

		// message logging
		messageEdited: {
			type: 'messages',
			icon: '',
			color: 'INFORMATION'
		},
		messageDeleted: {
			type: 'messages',
			icon: '',
			color: 'INFORMATION'
		},
		inviteDeleted: {
			type: 'messages',
			icon: '',
			color: 'NEGATIVE'
		},
		messagesPurged: {
			type: 'messages',
			icon: '',
			color: 'NEGATIVE'
		},

		// member logging
		memberJoined: {
			type: 'members',
			icon: '',
			color: 'INFORMATION'
		},
		memberPassedGate: {
			type: 'members',
			icon: '',
			color: 'INFORMATION'
		},
		memberLeft: {
			type: 'members',
			icon: '',
			color: 'INFORMATION'
		}
	},

	// urls
	url: {
		NekoAPI: 'https://nekos.life/api/v2/img/',
		PerspectiveAPI: 'https://commentanalyzer.googleapis.com/v1alpha1/',
		ImgurAPI: 'https://api.imgur.com/3',
		DiscordStatus: 'https://status.discord.com',
		AeroStatus: 'https://status.aero.bot'
	},

	badges: [
		{
			icon: ICON.CAW.DUO.BOLT,
			title: 'Aero Contributor'
		},
		{
			icon: ICON.CAW.DUO.CHECK,
			title: 'Trusted User'
		},
		{
			icon: ICON.CAW.DUO.LIKE,
			title: 'Certified Cutie'
		},
		null,
		{
			icon: ICON.CAW.DUO.EDIT,
			title: 'Documentation Scribe'
		},
		{
			icon: ICON.CAW.DUO.STAR,
			title: 'Community Support'
		},
	],

	regexes: {
		imgur: {
			image: /^https?:\/\/i\.imgur\.com\/(\w+)\.(?:jpg|png)$/i,
			album: /^https?:\/\/imgur\.com(?:\/a)?\/(\w+)$/i
		},
		discord: {
			cdn: /^https:\/\/cdn.discordapp.com\/attachments\/(?:\d){17,19}\/(?:\d){17,19}\/(?:.+?)(?:.png|.jpg)$/i
		},
		cancel: /^(?:cancel|stop|end)$/i,
		emoji: new RegExp(`^${require('emoji-regex')().source}$`)
	},

	userInfo: {
		providers: {
			ravy: 'the ravy.org trust meta-database',
			riverside: 'the Riverside Rocks dangerous Discord user database',
			ksoft: 'the KSoft.Si Discord ban archive',
			drep: 'the DiscordRep reputation database',
			dservices: 'the Discord.Services ban archive',
			azrael: 'the Azrael Interactive global ban database',
			frisky: 'Extra Frisky\'s list of known scammers'
		}
	},

	intents: {
		GUILDS: 1 << 0,
		/*
		 * GUILD_CREATE
		 * GUILD_DELETE
		 * GUILD_ROLE_CREATE
		 * GUILD_ROLE_UPDATE
		 * GUILD_ROLE_DELETE
		 * CHANNEL_CREATE
		 * CHANNEL_UPDATE
		 * CHANNEL_DELETE
		 * CHANNEL_PINS_UPDATE
		 */
		GUILD_MEMBERS: 1 << 1,
		/*
		 * GUILD_MEMBER_ADD
		 * GUILD_MEMBER_UPDATE
		 * GUILD_MEMBER_REMOVE
		 */
		GUILD_BANS: 1 << 2,
		/*
		 * GUILD_BAN_ADD
		 * GUILD_BAN_REMOVE
		 */
		GUILD_EMOJIS: 1 << 3,
		/*
		 * GUILD_EMOJIS_UPDATE
		 */
		GUILD_INTEGRATIONS: 1 << 4,
		/*
		 * GUILD_INTEGRATIONS_UPDATE
		 */
		GUILD_WEBHOOKS: 1 << 5,
		/*
		 * WEBHOOKS_UPDATE
		 */
		GUILD_INVITES: 1 << 6,
		/*
		 * INVITE_CREATE
		 * INVITE_DELETE
		 */
		GUILD_VOICE_STATES: 1 << 7,
		/*
		 * VOICE_STATE_UPDATE
		 */
		GUILD_PRESENCES: 1 << 8,
		/*
		 * PRESENCE_UPDATE
		 */
		GUILD_MESSAGES: 1 << 9,
		/*
		 * MESSAGE_CREATE
		 * MESSAGE_UPDATE
		 * MESSAGE_DELETE
		 */
		GUILD_MESSAGE_REACTIONS: 1 << 10,
		/*
		 * MESSAGE_REACTION_ADD
		 * MESSAGE_REACTION_REMOVE
		 * MESSAGE_REACTION_REMOVE_ALL
		 * MESSAGE_REACTION_REMOVE_EMOJI
		 */
		GUILD_MESSAGE_TYPING: 1 << 11,
		/*
		 * TYPING_START
		 */
		DIRECT_MESSAGES: 1 << 12,
		/*
		 * CHANNEL_CREATE
		 * MESSAGE_CREATE
		 * MESSAGE_UPDATE
		 * MESSAGE_DELETE
		 */
		DIRECT_MESSAGE_REACTIONS: 1 << 13,
		/*
		 * MESSAGE_REACTION_ADD
		 * MESSAGE_REACTION_REMOVE
		 * MESSAGE_REACTION_REMOVE_ALL
		 * MESSAGE_REACTION_REMOVE_EMOJI
		 */
		DIRECT_MESSAGE_TYPING: 1 << 14
		/*
		 * TYPING_START
		 */
	},

	punishments: {
		NONE: 1 << 0,
		STRIKE: 1 << 1,
		TEMPMUTE: 1 << 2,
		MUTE: 1 << 3,
		TEMPBAN: 1 << 4,
		BAN: 1 << 5
	},

	kaomoji: [
		'(*^ω^)',
		'(◕‿◕✿)',
		'(◕ᴥ◕)',
		'ʕ•ᴥ•ʔ',
		'ʕ￫ᴥ￩ʔ',
		'(*^.^*)',
		'owo',
		'OwO',
		'(｡♥‿♥｡)',
		'uwu',
		'UwU',
		'(*￣з￣)',
		'>w<',
		'^w^',
		'(つ✧ω✧)つ',
		'(/ =ω=)/',
		'^v^'
	],
};

module.exports.noop = () => { }; /* eslint-disable-line no-empty-function */

module.exports.zws = '\u200B';
