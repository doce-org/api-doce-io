'use strict';

const serialport = require( 'serialport' );
const _ = require( 'lodash' );

/**
 * defaults
 *
 * @type {Object}
 *
 * @const
 *
 * @author shad
 */
const defaults = {

	services: {
		'TEMP': '/transmitters/temperatures/records',
		'HUMIDITY': '/transmitters/humidities/records',
		'POWER': '/transmitters/powers/records',
		'WATER': '/transmitters/waters/records'
	},

	types: {
		'TEMP': 'temperature',
		'HUMIDITY': 'humidity',
		'POWER': 'power',
		'WATER': 'water'
	}

};

class Service {

	/**
	 * override constructor
	 * 
	 * @override
	 * 
	 * @author shad
	 */
	constructor() {

		// setup available events
		this.events = [ 'open', 'closed' ];

	}

	/**
	 * base setup for service
	 * 
	 * @override
	 * 
	 * @author shad
	 */
    setup( app ) {
        this.app = app;
		this.log = app.get( 'log' );
        this.serial = false;
    }

	/**
	 * override the find method to return the serial, if any available
	 * will return the current status of the serial connection
	 * 
	 * @override
	 * 
	 * @author shad
	 */
	find() {

		return Promise.resolve( { is_open: this.serial && this.serial.isOpen() } );

	}

    /**
     * setup catching open event on serial port connection
     * 
     * @author shad
     */
    _onOpenSerialPort() {

		let port = false;

		// list available ports to make sure one of the required
		// ones is available to open the serial connection
		serialport.list( ( err, ports ) => {

			// search for a proper port
			const com_names = ports.map( port => port.comName );
			const port_idx = _.findIndex( com_names, com_name => {

				return com_name === '/dev/ttyUSB0' || com_name === '/dev/ttyACM0';

			} );

			// if none of the required port has been found
			if ( port_idx === -1 ) {

				this.log( 'could not find a port to open the serial connection', 'error' );
				return;

			}

			// build the serial port connection
			this.serial = new serialport.SerialPort( com_names[ port_idx ], {
				baudrate: 230400,
				parser: serialport.parsers.readline( '\r\n' )
			} );

			// set other events support
			this._onSerialPortError();
			this._onSerialPortClosed();
			this._onDataReceivedSerialPort();

			this.serial.on( 'open', err => {

				if( err ) {

					this.log( `port opening error: ${err}`, 'error' );

					throw new errors.BadRequest( err );

				}

				// emit open connection event
				this.emit( 'open', {} );

				this.log( 'port open', 'debug' );

				// setInterval( () => {

				// 	function getRandomArbitrary( min, max ) {
				// 		return Math.random() * (max - min) + min;
				// 	}
				// 	const rand = getRandomArbitrary( 1, 180 );
				// 	// console.log( Math.round( rand ).toString() );
				// 	// this.serial.write( Math.round( rand ).toString() );
				// 	const cmd = {
				// 		type: 'CMD',
				// 		identifier: '2A65DJ1IOI91J90',
				// 		value: Math.round( rand ).toString()
				// 	};
				// 	console.log( JSON.stringify( cmd ) );
				// 	this.serial.write( JSON.stringify( cmd ) );

				// }, 10000 );

			} );

		} );

    }

	/**
     * setup catching error on serial port
     * 
     * @author shad
     */
    _onSerialPortError() {

        this.serial.on( 'error', err => {

			this.log( `port connection error: ${err}`, 'error' );

			// event
			this.emit( 'closed', { error: err } );

		} );

		this.serial.on( 'disconnect', message =>  {

			this.log( `port disconnected: ${message}`, 'warning' );

			// event
			this.emit( 'closed', { message: message } );

		} );

    }

	/**
     * setup catching closing serial port connection
     * 
     * @author shad
     */
    _onSerialPortClosed() {

        this.serial.on( 'close', () => {

			this.log( 'port connection has been closed', 'debug' );

			// event
			this.emit( 'closed', {} );

		} );

    }

	/**
	 * setup catching receiving data event on serial port connection
	 * 
	 * @author shad
	 */
	_onDataReceivedSerialPort() {

		this.serial.on( 'data', raw_data => {

			this.log( `port is receiving data: ${raw_data.toString()}`, 'debug' );

			// test received data is actually a valid JSON while
			// parsing and returning the parsed result or false
			const data = this._isJSON( raw_data );

			if ( data ) {

				// check if the setup boolean is there
				if ( data.setup ) {

					this.log( `port has received SETUP data`, 'debug' );
					
					this._setSetupData( data );

				}

				else {

					// if type of data isn't find in the permitted list of type
					if( !defaults.types[ data.type ] ) {

						this.log( `port has received data but could not find a type match`, 'warning' );
						return;

					}

					this.log( `port has received a proper type data: ${defaults.types[ data.type ]}`, 'debug' );

					// find the requested transmitter based on a given identifier and the type of the record
					this._findTransmitterPk( data ).then( transmitter => {

						// if none was found, no transmitter of the requested identifier exist. exiting
						if ( !transmitter ) {

							this.log( `could not find the requested transmitter identifier`, 'warning' );

							return;

						}

						this.log( `found the transmitter identifier requested: ${transmitter.name}`, 'debug' );

						this._recordNewData( data, transmitter );

					} );

				}

			}


		} );

	}

    /**
	 * find transmitter by ID
	 *
	 * @param {Integer} data
	 *
     * @return {Promise}
	 *
	 * @private
	 *
	 * @author shad
	 */
	_findTransmitterPk( data ) {

		// prepare the request query
		const query = { query: {

			// find the transmitter id
			'identifier': data.identifier,

			// type has to be the one requested
			'type': data.type

		} };

		return this.app.service( '/transmitters' )
		.find( query )
		.then( results => results.length > 0 && results[ 0 ] )
		.catch( console.error );

	}

    /**
	 * record new data in specified service
	 *
	 * @param {Array} data
	 * @param {Object} transmitter
	 *
	 * @private
	 *
	 * @author shad
	 */
	_recordNewData( data, transmitter ) {

		// get the service on which to save the new record
		const service = defaults.services[ data.type ];

		// extract only the data to be recorded by removing the type and the
		// transmitter identifier which aren't needed, everything else has to be
		// part of the requested service model ( temperature, power... )
		let values = _.omit( data, [ 'type', 'identifier' ] );

		// add to the required data the transmitter id previously found in `_findtransmitterPk`
		values = Object.assign( {}, { transmitter_id: transmitter.id }, values );

		return this.app.service( service )
		.create( values )
		.catch( console.error );

	}

    /**
	 * check if the received data is a proper JSON
	 *
	 * @param  {String}  str
	 *
	 * @author shad
	 */
	_isJSON( str ) {

		try {

			const result = JSON.parse( str );
			return result;

		}

		catch (e) {

			this.log( `port has failed to parse JSON data: ${str}`, 'error' );
			return false;

		}

	}

    /**
	 * set a temporary setup data for a transmitter to be registered
	 * 
	 * @param {String} data
	 * 
	 * @author shad
	 */
	_setSetupData( data ) {

		const query = { query: {

			identifier: data.identifier

		} };

		Promise.all( [

			this.app.service( '/transmitters' ).find( query ),
			this.app.service( '/setup/transmitters' ).find( query )

		] )
		.then( ( [ transmitters, setup_transmitters ] ) => {

			// if setup transmitter has already been registered
			if ( transmitters.length > 0 ) {

				return this.log( `setup data is an already registered transmitter with id: ${data.identifier}`, 'debug' );

			}

			// if setup transmitter has already been set up for registering
			if ( setup_transmitters.length > 0 ) {

				return this.log( `setup data is an already ready to be registered transmitter with id: ${data.identifier}`, 'debug' );

			}

			this.app
			.service( '/setup/transmitters' )
			.create( { type: data.type, identifier: data.identifier } )
			.catch( err => {

				this.log( `error while adding a new transmitter to be setup: ${err}`, 'error' );

			} );

		} )
		.catch( err => {

			this.log( `error while setting setup data: ${err}`, 'error' );

		} );


	}

	/**
	 * send a message through the serial port
	 * 
	 * @param {Object} data
	 * 
	 * @author shad
	 */
	_onSendMessageThroughSerial( data ) {

		const cmd = {
			type: 'CMD',
			identifier: data.identifier,
			value: data.value
		};

		this.log( `trying to send data to transmitter ${data.identifier}: ${data.value.toString()}` );
		
		this.serial.write( JSON.stringify( cmd ) );

	}

    /**
     * override the create service method to provide the
     * possibility to open the serial port connection
	 * 
	 * @param {Object} data
     * 
	 * @override
     * 
	 * @author shad
     */
    create( data ) {

		// if 'open' command, open the serial port
		if ( data.command === 'open' ) this._onOpenSerialPort();

		// if 'send' command, prepare sending message to serial port
		if ( data.command === 'send' ) this._onSendMessageThroughSerial( data );

		return Promise.resolve( {} );

    }

    /**
     * override the remove service method to provide the
     * possibility to close the serial port connection
     * 
     * @override
     * 
     * @author shad
     */
    remove() {

        // close the serial port
        this.serial.close();

        return Promise.resolve( {} );

    }

}

module.exports = function init() {
  	return new Service();
};
