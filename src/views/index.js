'use strict';

// services
const hardwareTemperature = require( './hardware_temperature' );

module.exports = function () {

    const app = this;

	// hardwares
	app.configure( hardwareTemperature );

};
