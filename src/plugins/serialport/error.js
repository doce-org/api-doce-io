'use strict';

/**
 * serial port error handling
 *
 * @param {Object} serial
 * @param {Object} port
 *
 * @author shad
 */
module.exports = function() {

	return function( serial, port ) {
		const app = this;

		serial.on( 'error', err => {

			// log
			app.service( '/logs' ).create( { message: `port ${port.name} connection error: ${err}` } );

		} );

		serial.on( 'disconnect', message =>  {

			// log
			app.service( '/logs' ).create( { message: `port ${port.name} disconnected: ${message}` } );

		} );

	};

};
