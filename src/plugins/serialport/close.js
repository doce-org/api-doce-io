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
			app.service( '/logs' ).create( { message: `port ${port.name} connection has been closed` } );

		} );

	}

};
