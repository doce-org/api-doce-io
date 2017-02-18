'use strict';

const serialport = require( 'serialport' );
const serial_data = require( './data' );
const serial_error = require( './error' );
const _ = require( 'lodash' );

module.exports = function() {
	const app = this;

	const handleSerial = function( data ) {

		const serial = new serialport.SerialPort( data.com_name, {
    	    baudrate: 115200,
    	    parser: serialport.parsers.readline( '\r\n' )
    	} );

		_serialerror( app, serial, data );
		_serialclose( app, serial, data );
		_serialdata( app, serial, data );
        _serialopen( app, serial, data );

	};

	app.set( 'serialPort', handleSerial );

}

/**
 * defaults values
 * @type {Object}
 * @author shad
 */
const defaults = {
	services: {
		'TEMP': 'temperatures/sensors',
		'HUMIDITY': 'humidities/sensors',
		'POWER': 'powers/gauges',
		'WATER': 'waters/gauges',
		'HARDWARE': 'hardwares'
	},
	values: {
		'TEMP': 'temperature',
		'HUMIDITY': 'humidity',
		'POWER': 'energy',
		'WATER': 'water'
	}
};

/**
 * handle opening the serial connection
 * @param {Object} serial
 * @param {Object} port
 * @author shad
 */
const _serialopen = function( app, serial, port ) {

	console.log( 'open' );

	serial.on( 'open', ( err ) => {

		if( err ) {

			// log
			app.service( '/logs' ).create( { message: `port ${port.name} opening error: ${err}` } );
			throw new errors.BadRequest( err );

		}

		// log
		app.service( '/logs' ).create( { message: `port open: ${port.name}` } );

	} );

}

/**
 * handle receiving data through the serial connection
 * @param {Object} serial
 * @param {Object} port
 * @author shad
 */
const _serialdata = function( app, serial, port ) {
	const format = [ 'type', 'hardware_id', 'value' ];

	serial.on( 'data', data => {

		// log
		app.service( '/logs' ).create( { message: `port ${port.name} is receiving data: ${data}` } );

		// data format: <TYPE>;<HARDWARE_ID>;<VALUE>
		// const split_data = data.split( ';' );
		// const data_obj = _.zipObject( format, split_data );
		// const dataIsValid = this._checkDataValidity( data_obj );

		// if( dataIsValid ) {
		//
		//     _findHardwarePk( data_obj ).then( id => {
		//
		//         if( id ) {
		//             this._recordNewData( data_obj, id );
		//         }
		//         else {
		//             this._createNewHardware( data_obj, port.id );
		//         }
		//
		//     } );
		//
		// }

	} );

}

/**
 * handle error on the serial connection
 * @param {Object} serial
 * @param {Object} port
 * @author shad
 */
const _serialerror = function( app, serial, port ) {

	serial.on( 'error', err => {

		// log
		app.service( '/logs' ).create( { message: `port ${port.name} connection error: ${err}` } );

	} );

	serial.on( 'disconnect', message =>  {

		// log
		app.service( '/logs' ).create( { message: `port ${port.name} disconnected: ${message}` } );

	} );

}

/**
 * handle closing the serial connection
 * @param {Object} serial
 * @param {Object} port
 * @author shad
 */
const _serialclose = function( app, serial, data ) {

	serial.on( 'close', () => {

		// log
		app.service( '/logs' ).create( { message: `port ${port.name} connection has been closed` } );

	} );

}

/**
 * find hardware by ID
 * @param {integer} data
 * @return {Promise}
 * @private
 * @author shad
 */
const _findHardwarePk = function( data ) {

	// debug( `trying to find hardware id: ${data.hardware_id}` );

	return this.app.services( '/hardwares' )
		.find( { query: { hardware_id: data.hardware_id } } )
		.then( results => results.length > 0 && results[ 0 ].id )
		.catch( console.error );

}

/**
 * create a new hardware
 * @param {Object} data
 * @param {String} port_id
 * @private
 * @author shad
 */
const _createNewHardware = function( data, port_id ) {

	// debug( `registering a new hardware with id: ${data.hardware_id}` );

	this.app.services( '/hardwares' ).create( { type: data.type, hardware_id: data.hardware_id, port_id } )
		.catch( console.error );

}

/**
 * record new data in specified service
 * @param {String} service
 * @param {Array} data
 * @param {integer} id
 * @private
 * @author shad
 */
const _recordNewData = function( data, id ) {

	let service = defaults.service[ data.type ];
	const value = defaults.values[ data.type ];
	service = `${service}/records`;

	// debug( `record new data: ${data.value} in service: ${service}`);

	app.services[ service ].create( { hardware_id: id, [ value ]: data.value } )
		.then( res => debug( `new data: added in service: ${service}` ) )
		.catch( console.error );

}

/**
 * check data validity
 * @param {Array} data
 * @author shad
 */
const _checkDataValidity = function( data ) {

	// if type of data isn't find in the permitted list of type
	if( !defaults[ data.type ] ) {
		return;
	}

	// hardware id has to have a length of 8 char.
	if( data.hardware_id.length !== 8 ) {
		return;
	}

	return true;

}
