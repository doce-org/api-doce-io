'use strict';

const cron = require( 'node-cron' );

module.exports = function( app ) {

	/**
	 * calculate month average temperature
	 * each first day of month at 00:01 AM
	 * @author shad
	 */
	cron.schedule( '1 0 1 * *', () => {

	} );

}