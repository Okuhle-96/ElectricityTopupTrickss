const assert = require("assert");
const pg = require('pg');
const Pool = pg.Pool;
const ElectricityMeters = require('../electricity-meters');

const connectionString = process.env.DATABASE_URL || 'postgresql://coderr:1996@localhost:5432/topups_db_tests';

const pool = new Pool({
    connectionString  
});

describe("The Electricity meter", function() {

	this.beforeAll(function() {
		pool.query(`update electricity_meter set balance = 50`);
	});

	it("should see all the streets", async function() {
		const electricityMeters = ElectricityMeters(pool);
		const streets = await electricityMeters.streets();

		const streetList = [
			 {
			   "id": 1,
			   "name": "Miller Street"
			 },
			 {
			   "id": 2,
			   "name": "Mathaba Crescent"
			 },
			 {
			   "id": 3,
			   "name": "Vilakazi Road"
			 }]
			

		assert.deepStrictEqual(streetList, streets);

	});

	it("should show all the meters and their balances", async function() {

		const electricityMeters = ElectricityMeters(pool);
		const meters = await electricityMeters.streetMeters();

		assert.deepStrictEqual([], meters);

	});


	it("should see all the appliances", async function() {

		const electricityMeters = ElectricityMeters(pool);
		const appliances = await electricityMeters.appliances();
		
		assert.deepStrictEqual([
			  {
			    id: 1,
			    name: 'Stove',
			    rate: '4.50'
			  },
			  {
			    id: 2,
			    name: 'TV',
			    rate: '1.80'
			  },
			  {
			    id: 3,
			    name: 'Heater',
			    rate: '3.50'
			  },
			  {
			    id: 4,
			    name: 'Fridge',
			    rate: '4.00'
			  },
			  {
			    id: 5,
			    name: 'Kettle',
			    rate: '2.70'
			  }
			]
			, appliances);

	});

	// it("should be able to topup electricity", async function() {

	// 	const electricityMeters = ElectricityMeters(pool);
	// 	const appliances = await electricityMeters.topupElectricity(3, 20);
	// 	const meterData = await electricityMeters.meterData(3);
	// 	assert.deepStrictEqual(0, meterData.balance);

	// });

	// it("should be able to use electricity", async function() {

	// 	const electricityMeters = ElectricityMeters(pool);
	// 	const appliances = await electricityMeters.useElectricity(2, 20);
	// 	const meterData = await electricityMeters.meterData(2);
	// 	assert.deepStrictEqual(30, meterData.balance);

	// });

	this.afterAll(function() {
		pool.end();
	});

});