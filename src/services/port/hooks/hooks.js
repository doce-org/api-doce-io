'use strict';

const serialPort = require( 'serialport' );

exports.listSerialPorts = function() {

	return function( hook ) {

		return new Promise( ( resolve, reject ) => {
			serialPort.list( function ( err, ports ) {
				hook.result = ports;
				resolve( hook );
			} );
		} );

	}

};
