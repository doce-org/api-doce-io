'use strict';

// hardwares
const hardwareTemperatureAvgDetailed = require( './hardwares_temperatures_avg_detailed' );
const hardwareHumidityAvgDetailed = require( './hardwares_humidities_avg_detailed' );

// records
const lastRecordPerHardware = require( './last_record_per_hardware' );
const recordTemperatureAvgLast24Hours = require( './record_temperature_avg_last_24_hours' );
const recordHumidityAvgLast24Hours = require( './record_humidity_avg_last_24_hours' );

module.exports = function () {

    const app = this;

	// hardwares
	app.configure( hardwareTemperatureAvgDetailed );
	app.configure( hardwareHumidityAvgDetailed );

	// records
	app.configure( lastRecordPerHardware );
	app.configure( recordTemperatureAvgLast24Hours );
	app.configure( recordHumidityAvgLast24Hours );

};
