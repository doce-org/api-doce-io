'use strict';

const hour_cron = require( './hour.cron' );

module.exports = function() {
	const app = this;

	app.configure( hour_cron );
}


