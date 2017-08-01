'use strict';

// transmitters
const transmitterTemperatureAvgDetailed = require( './transmitters_temperatures_avg_detailed' );
const transmitterHumidityAvgDetailed = require( './transmitters_humidities_avg_detailed' );

// records
const lastRecordPerTransmitter = require( './last_record_per_transmitter' );

module.exports = function () {

    const app = this;

	// transmitters
	app.configure( transmitterTemperatureAvgDetailed );
	app.configure( transmitterHumidityAvgDetailed );

	// records
	app.configure( lastRecordPerTransmitter );

};
