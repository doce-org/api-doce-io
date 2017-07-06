'use strict';

// transmitters
const transmitterTemperatureAvgDetailed = require( './transmitters_temperatures_avg_detailed' );
const transmitterHumidityAvgDetailed = require( './transmitters_humidities_avg_detailed' );

module.exports = function () {

    const app = this;

	// transmitters
	app.configure( transmitterTemperatureAvgDetailed );
	app.configure( transmitterHumidityAvgDetailed );

};
