'use strict';

/**
 * serial port error handling
 * @param {Object} serial
 * @author shad
 */
module.exports = function( serial ) {

	serial.on( 'error', err => {

		console.error( `error: ${err}` );

	} );

	serial.on( 'disconnect', message =>  {

		console.error( `disconnected: ${message}` ) ;

	} );

}