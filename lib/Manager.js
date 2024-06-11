/*
 * Co-Authored-By: rxsto <rxsto@aero.bot> (https://rxs.to)
 * Co-Authored-By: mint <mint@aero.bot> (https://dsc.ng)
 * 
 * Credit-Example:
 * [rxsto](https://rxs.to), [mint](https://dsc.ng) @ [Aero](https://aero.bot)
 */

const Aero = require('./Aero');
const Websocket = require('./ws/Websocket');
const Reconnector = require('./ws/Reconnector');
const express = require('express');
const { hostname } = require('os');

const kube = process.env.KUBE_ENABLED === 'true';

module.exports = class Manager {

	constructor(sentry) {
		this.client = new Aero({ sentry }, this);

		const hostnameChunk = hostname().split('-').pop();
		const logPrefix = `[${hostnameChunk}] [Shard::Manager]`;
		const log = (l) => (a, ...b) => {
			this.client.console[l](`${logPrefix} ${a}`, ...b);
			return true; // allow && chaining
		}

		this.c = {
			i: log("log").bind(this),
			w: log("warn").bind(this),
			e: log("error").bind(this),
		}


		if (!kube)
			// launch immediately
			return this.launch({ shardCount: 1 });

		// set up health check and clustering
		this.id = Number(hostnameChunk);
		this.ws = new Websocket(this);
		this.reconnector = new Reconnector(this);

		const { PROBES_API_PORT: port } = process.env;
		this.api = express();
		this.api.get('/health', (_, c) => c.status(200));
		this.api.get('/ready', (_, c) => c.status(200));
		this.api.get('/shutdown', (_, c) => this.c.w('received shutdown') && c.status(200));
		this.api.listen(port, () => this.c.i(`probes API on :${port}`));
	}

	init() {
		if (!kube) return;

		this.ws.init();
		this.ws.on('open', () => this.c.i('WS opened') && this.reconnector.open());
		this.ws.on('close', (c, mes) => this.c.w('WS closed') && this.reconnector.close(c, mes));
		this.ws.on('error', (err) => this.c.e('WS errored') && this.reconnector.err(err));
	}

	launch(data) {
		this.c.i('attempting to login');
		this.client.login(data);
	}

};
