const { MongoClient } = require('mongodb');

class MongoDBProvider {

	constructor(client, options = {}) {
		this.client = client;
		this.db = null;
		this.cache = new Map();
		this.options = options;
		this.mongoClient = null;
	}

	async init() {
		const { connectionString, db, options } = this.options;
		
		if (!connectionString) {
			this.client.logger.warn('[MongoDB] No connection string provided, using in-memory cache only');
			return;
		}

		try {
			this.mongoClient = new MongoClient(connectionString, options);
			await this.mongoClient.connect();
			this.db = this.mongoClient.db(db);
			this.client.logger.info(`[MongoDB] Connected to database: ${db}`);
		} catch (error) {
			this.client.logger.error('[MongoDB] Failed to connect, falling back to in-memory cache', error);
		}
	}

	async get(table, id) {
		if (this.db) {
			try {
				const collection = this.db.collection(table);
				const data = await collection.findOne({ id });
				return data || null;
			} catch (error) {
				this.client.logger.error(`[MongoDB] Error getting ${id} from ${table}`, error);
			}
		}
		return this.cache.get(`${table}:${id}`) || null;
	}

	async create(table, id, data) {
		const doc = { id, ...data };
		
		if (this.db) {
			try {
				const collection = this.db.collection(table);
				await collection.insertOne(doc);
				return doc;
			} catch (error) {
				this.client.logger.error(`[MongoDB] Error creating ${id} in ${table}`, error);
			}
		}
		
		this.cache.set(`${table}:${id}`, doc);
		return doc;
	}

	async update(table, id, data) {
		if (this.db) {
			try {
				const collection = this.db.collection(table);
				await collection.updateOne({ id }, { $set: data });
				return true;
			} catch (error) {
				this.client.logger.error(`[MongoDB] Error updating ${id} in ${table}`, error);
			}
		}
		
		const key = `${table}:${id}`;
		const existing = this.cache.get(key) || { id };
		this.cache.set(key, { ...existing, ...data });
		return true;
	}

	async replace(table, id, data) {
		const doc = { id, ...data };
		
		if (this.db) {
			try {
				const collection = this.db.collection(table);
				await collection.replaceOne({ id }, doc, { upsert: true });
				return doc;
			} catch (error) {
				this.client.logger.error(`[MongoDB] Error replacing ${id} in ${table}`, error);
			}
		}
		
		this.cache.set(`${table}:${id}`, doc);
		return doc;
	}

	async delete(table, id) {
		if (this.db) {
			try {
				const collection = this.db.collection(table);
				await collection.deleteOne({ id });
				return true;
			} catch (error) {
				this.client.logger.error(`[MongoDB] Error deleting ${id} from ${table}`, error);
			}
		}
		
		return this.cache.delete(`${table}:${id}`);
	}

	async has(table, id) {
		if (this.db) {
			try {
				const collection = this.db.collection(table);
				const count = await collection.countDocuments({ id });
				return count > 0;
			} catch (error) {
				this.client.logger.error(`[MongoDB] Error checking ${id} in ${table}`, error);
			}
		}
		
		return this.cache.has(`${table}:${id}`);
	}

	async shutdown() {
		if (this.mongoClient) {
			await this.mongoClient.close();
			this.client.logger.info('[MongoDB] Connection closed');
		}
	}

}

module.exports = MongoDBProvider;
