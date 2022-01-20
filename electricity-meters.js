// this is our
module.exports = function(pool) {

	// list all the streets the we have on records
	async function streets() {
		const streets = await pool.query(`select * from street`);
		return streets.rows;
	}

	// for a given street show all the meters and their balances
	async function streetMeters(streetId) {
		const strMeter = await pool.query(`select balance from electricity_meter where street_id = $1`, [streetId])
		return strMeter.rows;
	}

	// return all the appliances
	async function appliances() {
		const appliances = await pool.query(`select * from appliance`);
		return appliances.rows;
	}

	// return the data for a given balance
	async function meterData(meterId) {
		const meters = await pool.query(`select * from electricity_meter where id = $1`,[meterId]);
		return meters.rows;
	}

	// topup electricity
	async function topupElectricity(meterId, units) {
		const topup = await pool.query(`update electricity_meter set balance = $1 where id = $2`, [units, meterId]);
		return topup.rows;
	}


	// decrease the meter balance for the meterId supplied
	async function useElectricity(meterId, units) {
		const newBalance = await pool.query(`
		update electricity_meter.balance 
		sum(appliance.rate) - sum(electricity_meter.balance)
		as total from electricity_meter 
		inner join appliance 
		on electricity_meter.id = appliance.id`, [meterId, units])
		return newBalance.rows;
	}

	// calculate min balance
	async function lowestBalanceMeter(){
		const minBal = await pool.query(`
		select street_name 
		from street 
		join electricity_meter 
		on electricity_meter.street_id = street.id 
		order by asc 
		limit 1`);
		return minBal;
	}

	// calculate highest balance
	async function highestBalanceStreet(){
		const maBal = await pool.query(`
		select sum(balance) as highest_bal 
		from electricity_meter 
		join street on street.id = electricity_meter.street_id 
		group by name 
		order by desc
		limit 1`);
		return maBal;
	}

	// calculate total balance
	async function totalStreetBalance(streetId){
		const totalStrBal = `
		select sum(rate * balance) as total_bal
		from street
		join street_item on street_item.street_id = street.id
		join appliance on street_id = street_item.street_id
		where street.id = $1`

		const total = await pool.query(totalStrBal, [streetId]);
		return total;
	}

	return {
		streets,
		streetMeters,
		appliances,
		topupElectricity,
		meterData,
		useElectricity,
		lowestBalanceMeter,
		highestBalanceStreet,
		totalStreetBalance
	}


}