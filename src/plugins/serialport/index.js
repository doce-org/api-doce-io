'use strict';

const serialPort = require( 'serialport' );
const serial_data = require( './data' );
const serial_error = require( './error' );

module.exports = function() {
	const app = this;

	const serial = new serialPort.SerialPort( '/dev/tty.wchusbserial640', {
	    baudrate: 115200,
	    parser: serialPort.parsers.readline( '\r\n' )
	} );
	serial.on( 'open', () => console.log( 'Serial port is ready' ) );
	serial.on( 'close', () => console.log( 'Port closed' ) );

	serial_data( app, serial );
	serial_error( app, serial );

}


