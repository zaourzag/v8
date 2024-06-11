const { Client } = require('@aero/framework');

const { XKCDClient } = require('@aero/xkcd');
const { CoronaClient } = require('@aero/corona');
const { CoronaGraphsClient } = require('@aero/corona-graphs');
const { StatusPageClient } = require('@aero/statuspage');

const { klasa, discord, aero } = require('../config');
const { AeroStatus, DiscordStatus } = require('./util/constants').url;
const Permissions = require('./Permissions');
const InteractionRouter = require('./InteractionRouter');
Client.use(require('@aero/member-gateway'));
require('./extensions');
require('./settings');

const { hostname } = require('os');

class Aero extends Client {

	constructor({ sentry, aggregator, ...sharder }) {
		super({ ...klasa, ...discord, ...sharder });
		if (sentry) {
			this.sentry = sentry;
			this.sentry.setTag('shard', this.options.shards.join(', '));
			this.sentry.setTag('host', hostname());
			this.console.log('[Sentry] Connected.');
		}
		this.aggregator = aggregator;

		this.permissions = new Permissions(this);
		this.config = aero;
		this.xkcd = new XKCDClient();
		this.corona = new CoronaClient();
		this.coronagraphs = new CoronaGraphsClient(this.corona, this.config.chartgenURL);
		this.dstatus = new StatusPageClient(DiscordStatus);
		this.astatus = new StatusPageClient(AeroStatus);
		this.experiments = new Map();

		this.router = new InteractionRouter(this);
	}

	async login() {
		this.console.log(`[Discord] Attempting to login on shards [${this.options.shards.join(', ')}].`);
		super.login();
		this.aggregator.login(this);
	}

}

module.exports = Aero;
