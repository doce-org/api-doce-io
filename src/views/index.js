'use strict';

// services
const hardwareTemperature = require( './hardware_temperature' );
const hardwareHumidity = require( './hardware_humidity' );

module.exports = function () {

    const app = this;

	// hardwares
	app.configure( hardwareTemperature );
	app.configure( hardwareHumidity );

};
