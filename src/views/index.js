'use strict';

// transmitters
const transmitterTemperatureAvgDetailed = require( './transmitters_temperatures_avg_detailed' );
const transmitterHumidityAvgDetailed = require( './transmitters_humidities_avg_detailed' );

// records
const lastRecordPerTransmitter = require( './last_record_per_transmitter' );
const recordTemperatureAvgLast24Hours = require( './record_temperature_avg_last_24_hours' );
const recordHumidityAvgLast24Hours = require( './record_humidity_avg_last_24_hours' );

module.exports = function () {

    const app = this;

	// transmitters
	app.configure( transmitterTemperatureAvgDetailed );
	app.configure( transmitterHumidityAvgDetailed );

	// records
	app.configure( lastRecordPerTransmitter );
	app.configure( recordTemperatureAvgLast24Hours );
	app.configure( recordHumidityAvgLast24Hours );

};
