'use strict';

/**
 * handle connection closing
 *
 * @param {Object} serial
 * @param {Object} port
 *
 * @return {Function}
 *
 * @author shad
 */
module.exports = function() {

	return function( serial, port ) {
		const app = this;

		serial.on( 'close', () => {

			// log
			app.service( '/logs' ).create( { message: `port connection has been closed` } );

		} );

	}

};
