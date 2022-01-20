const express = require('express');
const exphbs  = require('express-handlebars');
const pg = require('pg');
const Pool = pg.Pool;

const app = express();
const PORT =  process.env.PORT || 3017;

const ElectricityMeters = require('./electricity-meters');

const connectionString = process.env.DATABASE_URL || 'postgresql://coderr:1996@localhost:5432/topups_db';

const pool = new Pool({
    connectionString  
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const electricityMeters = ElectricityMeters(pool);

app.get('/', function (req, res) {
	res.redirect('/streets');
});

app.get('/streets', async function (req, res) {
	const streets = await electricityMeters.streets();
	res.render('streets', {
		streets
	});
});

app.get('/appliances', async function (req, res) {
		const appliances = await electricityMeters.appliances()
		res.render('appliances', {
			appliances
		});
})

app.get('/meters/:street_id', async function (req, res) {
		const street_id = req.params.street_id;
		const meters = await electricityMeters.streetMeters(street_id);
		res.render('meters', {
			meters
		});
});

app.get('/meters/use/:meter_id', async function (req, res) {
	// time time time!!!
	('use_electicity', {
			usage
		});
});

app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});
