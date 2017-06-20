'use strict';

const serialport = require( 'serialport' );
const serial_open = require( './open' );
const serial_data = require( './data' );
const serial_error = require( './error' );
const serial_close = require( './close' );
const _ = require( 'lodash' );

let connection;

module.exports = function() {
	const app = this;

	// build the serial port interface
	const serialFunctions = {

		open() {

			// prepare the serial port
			// @type {SerialPort}
			connection = new serialport.SerialPort( '/dev/ttyUSB0', {
				baudrate: 115200,
				parser: serialport.parsers.readline( '\r\n' )
			} );

			// call init on each events
			//
			// error
			const onError = serial_error().bind( app );
			onError( connection, data );

			// close
			const onClose = serial_close().bind( app );
			onClose( connection, data );

			// data
			const onData = serial_data().bind( app );
			onData( connection, data );

			// open
			const onOpen = serial_open().bind( app );
			onOpen( connection, data );

		},

		close() {

			// close the connection
			connection.close();

		}

	}

	app.set( 'serialPort', handleSerial );

}
