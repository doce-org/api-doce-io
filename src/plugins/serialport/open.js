'use strict';

const errors = require( 'feathers-errors' );

/**
 * handle opening the serial connection
 *
 * @param {Object} serial
 * @param {Object} port
 *
 * @author shad
 */
module.exports = function() {

	return function( serial, port ) {
		const app = this;

		serial.on( 'open', ( err ) => {

			if( err ) {

				app.service( '/logs' ).create( { message: `port opening error: ${err}` } );
				throw new errors.BadRequest( err );

			}

			app.service( '/logs' ).create( { message: `port open` } );
			
			// set connection to active
			app.service( '/connection' ).create( { port: '/dev/ttyUSB0', active: true } );

		} );

	}

};
