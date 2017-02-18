'use strict';

const serialport = require( 'serialport' );
const serial_open = require( './open' );
const serial_data = require( './data' );
const serial_error = require( './error' );
const serial_close = require( './close' );
const _ = require( 'lodash' );

module.exports = function() {
	const app = this;

	// build the serial port interface
	const handleSerial = function( data ) {

		// prepare the serial port
		// @type {SerialPort}
		const serial = new serialport.SerialPort( data.com_name, {
    	    baudrate: 115200,
    	    parser: serialport.parsers.readline( '\r\n' )
    	} );

		// call init on each events
		//
		// error
		const onError = serial_error().bind( app );
		onError( serial, data );

		// close
		const onClose = serial_close().bind( app );
		onClose( serial, data );

		// data
		const onData = serial_data().bind( app );
		onData( serial, data );

		// open
		const onOpen = serial_open().bind( app );
		onOpen( serial, data );

	};

	app.set( 'serialPort', handleSerial );

}
