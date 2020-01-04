const Endpoint = require('./endpoint');
const Pot = require('../models/pot');

/**
 * A Wrapper for the Pots endpoint.
 * @see https://monzo.com/docs#pots
 */
module.exports = class Pots extends Endpoint {
	/**
	 * Creates an instance of Pots.
	 * @param {Monzo} client - An instance of the Monzo client.
	 */
	constructor(client) {
		super(client, 'pots');
		/**
		 * An instance of the Monzo client.
		 * @type {Monzo}
		 * @private
		 */
		this._client = client;
	}

	/**
	 * Get all of the user's Pots.
	 * @type {Map<Pot>}
	 */
	async all() {
		try {
			const res = await this.get();
			const pots = new Map();
			for (const pot of res.data.pots) {
				pots.set(pot.id, new Pot(pot));
			}
			return pots;
		} catch (err) {
			console.log(err.message);
		}
	}

	/**
	 * Find pot with a specific Id.
	 * @param {string} potId The Id of the pot to find.
	 * @type {Pot}
	 */
	async find(potId) {
		try {
			const pots = await this.all();
			for (const [id, pot] of pots) {
				if (id === potId) {
					return pot;
				}
			}
			return null;
		} catch (err) {
			console.log(err.message);
		}
	}

	/**
	 * Withdraw the specified amount from the speified pot.
	 * @param {string} accountId The account Id to withdraw to.
	 * @param {string} potId The id of the pot to withdraw from.
	 * @param {integer} amount The amount to withdraw.
	 */
	async withdraw(accountId, potId, amount) {
		try {
			const data = {
				destination_account_id: accountId,
				amount: amount,
				dedupe_id: `${Math.random()
					.toString(36)
					.substring(2, 15) +
					Math.random()
						.toString(36)
						.substring(2, 15)}`
			};
			return await this.put(potId + '/withdraw', data);
		} catch (err) {
			console.log(err.message);
		}
	}

	async deposit(accountId, potId, amount) {
		try {
			const data = {
				source_account_id: accountId,
				amount: amount,
				dedupe_id: `${Math.random()
					.toString(36)
					.substring(2, 15) +
					Math.random()
						.toString(36)
						.substring(2, 15)}`
			};
			const res = await this.put(potId + '/deposit', data);
			return res;
		} catch (err) {
			console.log(err.message);
		}
	}
};
