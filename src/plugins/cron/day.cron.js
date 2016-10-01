'use strict';

const cron = require( 'node-cron' );

module.exports = function( app ) {

	/**
	 * calculate a day average temperature
	 * triggered every a 00:01 AM
	 * @author shad
	 */
	cron.schedule( '1 0 * * *', () => {

		 

	} );

};