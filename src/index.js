const { join } = require('path');
require('dotenv').config({
	path: '.env'
});

const { ShardingManager } = require('kurasuta');
const Aero = require('../lib/Aero');
const { KlasaConsole } = require('@aero/framework');
const logger = new KlasaConsole();
const { stage: version, ipcSocket, metricsEnabled, accessPort, stageShorthand, ngrokRegion, ngrokPrefix } = require('../config/aero');
const Aggregator = require('../lib/Aggregator');
const AggregatorClient = require('../lib/AggregatorClient');
const ngrok = require('ngrok');
const express = require('express');
const { spawn } = require('child_process');

const cluster = require('cluster');

async function main() {
	// prometheus & remote
	const app = express();
	const aggregator = new Aggregator(stageShorthand, metricsEnabled);

	logger.log(`[express] ${process.env.REMOTE_TOKEN ? 'Using' : 'Not using'} token authentication`);
	app.use('/', (req, res, next) => {
		if (!process.env.REMOTE_TOKEN) return next();

		const header = req.get('Authorization');

		if (!header) {
			return res.status(401).json({
				error: 'token_missing'
			});
		}

		const [type, token] = header.split(' ').map(str => str?.toLowerCase());

		if (type !== 'bearer') {
			return res.status(401).json({
				error: 'token_invalid_type'
			});
		}

		if (token !== process.env.REMOTE_TOKEN) {
			return res.status(401).json({
				error: 'token_invalid'
			});
		}

		return next();
	});

	app.get('/', async (req, res) => res.status(200).json({ ping: await aggregator.averagePing(), ready: aggregator.ready }));

	if (metricsEnabled) {
		app.get('/metrics', async (req, res) => {
			if (!aggregator.ready) return res.status(500).end('not-ready');
			try {
				res.set('Content-Type', aggregator.register.contentType);
				return res.end(await aggregator.register.metrics());
			} catch (ex) {
				logger.error(ex);
				return res.status(500).end(ex.toString());
			}
		});
		logger.log('[express] Registered metrics endpoint');
	}

	app.listen(accessPort);
	logger.log(`[express] Listening on :${accessPort}`);

	const opts = {
		addr: accessPort,
		subdomain: `${ngrokPrefix}-${stageShorthand}`
	};

	if (process.env.PGROK_ENABLED === 'true') {
		spawn('pgrok', ['-config', join(process.cwd(), '.pgrok'), '-subdomain', opts.subdomain, opts.addr], { stdio: 'ignore' });
		console.clear();
		logger.log(`[pgrok] proxying :${accessPort} <- ${opts.subdomain}.ravy.sh`);
	}
	else if (process.env.NGROK_TOKEN) {
		opts.authtoken = process.env.NGROK_TOKEN;
		opts.region = ngrokRegion;

		await ngrok.connect(opts)
			.then((url) => logger.log(`[ngrok] proxying :${accessPort} <- ${url}`))
			.catch(() => logger.error(`[ngrok] failed to start`));
	}
	else {
		logger.log(`[ngrok] not automatically proxying :${accessPort}`);
	}

	cluster.on('message', (worker, msg) => {
		if (msg?.type !== 'LOGIN') return;
		logger.log('[Aggregator] Connecting succeeded.');

		aggregator.login(worker);
	});

	const sharder = new ShardingManager(join(__dirname, 'launch'), {
		client: Aero,
		ipcSocket,
		token: process.env.DISCORD_TOKEN
	});

	sharder.on('debug', (msg) => {
		logger.debug(msg);
	});

	sharder.on('shardReady', (id) => {
		logger.log(`[Sharder] Shard ${id} ready.`);
	});

	sharder.on('shardDisconnect', (event, id) => {
		logger.log(`[Sharder] Shard ${id} disconnected: ${event.reason}`);
	});

	sharder.on('shardResume', (_replayed, id) => {
		logger.log(`[Sharder] Shard ${id} resumed.`);
	});

	sharder.on('shardReconnect', (id) => {
		logger.log(`[Sharder] Shard ${id} reconnected.`);
	});

	sharder.spawn();
	logger.log('[Aggregator] Launching primary.');
}

function secondary() {
	logger.log('[Aggregator] Connecting to primary.');
	process.send({ type: 'LOGIN' });

	// sentry
	let sentry;
	if (version !== 'development' && process.env.SENTRY_TOKEN) {
		sentry = require('@sentry/node');

		sentry.init({
			dsn: process.env.SENTRY_TOKEN,
			release: `aero@${version}`
		});
	}

	const aggregator = new AggregatorClient(metricsEnabled);

	const sharder = new ShardingManager(join(__dirname, 'launch'), {
		client: Aero,
		clientOptions: {
			sentry,
			aggregator
		},
		ipcSocket,
		token: process.env.DISCORD_TOKEN
	});

	sharder.spawn();
}

logger.log(`[Aggregator] Initiating ${cluster.isPrimary ? 'primary' : 'secondary'}.`)
if (cluster.isPrimary) main();
else secondary();

