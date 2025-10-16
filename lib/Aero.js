const { SapphireClient, container } = require('@sapphire/framework');
const { XKCDClient } = require('@aero/xkcd');
const { CoronaClient } = require('@aero/corona');
const { CoronaGraphsClient } = require('@aero/corona-graphs');
const { StatusPageClient } = require('@aero/statuspage');

const { discord, aero } = require('../config');
const { AeroStatus, DiscordStatus } = require('./util/constants').url;
const Permissions = require('./Permissions');
const InteractionRouter = require('./InteractionRouter');
const MongoDBProvider = require('./providers/MongoDBProvider');

require('./extensions');
require('./settings');

const { hostname } = require('os');

class Aero extends SapphireClient {

	constructor({ sentry, aggregator, ...sharder }) {
		const config = require('../sapphire.config');
		super({
			...discord,
			...sharder,
			...config,
			baseUserDirectory: null,
			loadMessageCommandListeners: true
		});

		if (sentry) {
			this.sentry = sentry;
			this.sentry.setTag('shard', this.options.shards.join(', '));
			this.sentry.setTag('host', hostname());
			this.logger.info('[Sentry] Connected.');
		}
		this.aggregator = aggregator;

		// Initialize providers
		this.providers = {
			default: null
		};

		this.permissions = new Permissions(this);
		this.config = aero;
		this.xkcd = new XKCDClient();
		this.corona = new CoronaClient();
		this.coronagraphs = new CoronaGraphsClient(this.corona, this.config.chartgenURL);
		this.dstatus = new StatusPageClient(DiscordStatus);
		this.astatus = new StatusPageClient(AeroStatus);
		this.experiments = new Map();

		this.router = new InteractionRouter(this);

		// Store client in container for global access
		container.client = this;
	}

	// Backwards compatibility getter
	get console() {
		return this.logger;
	}

	async login(token) {
		// Initialize MongoDB provider
		const { prefix, stage, owners } = require('../config/aero');
		const db = {
			production: 'aero',
			staging: 'aero-staging',
			development: 'aero-dev',
			testing: 'aero-test'
		}[stage];

		const { MONGO_URI: uri } = process.env;

		const mongoProvider = new MongoDBProvider(this, {
			connectionString: uri,
			db,
			options: {
				forceServerObjectId: true
			}
		});

		await mongoProvider.init();
		this.providers.default = mongoProvider;

		this.logger.info(`[Discord] Attempting to login on shards [${this.options.shards.join(', ')}].`);
		await super.login(token);
		this.aggregator.login(this);
	}

}

module.exports = Aero;
