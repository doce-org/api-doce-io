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
		'POWER': 'energy',
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
        this.serial = false;
    }

    /**
     * setup catching open event on serial port connection
     * 
     * @author shad
     */
    _onOpenSerialPort() {

		// build the serial port connection
		this.serial = new serialport.SerialPort( '/dev/ttyUSB0', {
			baudrate: 115200,
			parser: serialport.parsers.readline( '\r\n' )
		} );

        this.serial.on( 'open', err => {

			if( err ) {

				this.app.service( '/logs' ).create( { message: `port opening error: ${err}` } );
				throw new errors.BadRequest( err );

			}

			this.emit( 'open', {} );
			this.app.service( '/logs' ).create( { message: `port open` } );

		} );

    }

	/**
     * setup catching error on serial port
     * 
     * @author shad
     */
    _onSerialPortError() {

        this.serial.on( 'error', err => {

			// log
			this.app.service( '/logs' ).create( { type: 'error', message: `port connection error: ${err}` } );

			// event
			this.emit( 'closed', { error: err } );

		} );

		this.serial.on( 'disconnect', message =>  {

			// log
			this.app.service( '/logs' ).create( { type: 'warning', message: `port disconnected: ${message}` } );

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

			// log
			this.app.service( '/logs' ).create( { message: `port connection has been closed` } );

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

			this.app.service( '/logs' ).create( { message: `port is receiving data: ${raw_data}` } );

			// test received data is actually a valid JSON while
			// parsing and returning the parsed result or false
			const data = this._isJSON( raw_data );

			if ( data ) {

				// check if receiving setup data
				if ( this._isSetupData( data ) ) {

					this._setSetupData( data );

				}

				// otherwise, directly check if the received data is of
				// a proper format to go on saving it in database
				else if ( this._dataIsValid( data ) ) {

					// find the requested transmitter based on a given identifier and the type of the record
					this._findTransmitterPk( data ).then( transmitter => {

						// if none was found, no transmitter of the requested identifier exist. exiting
						if ( !transmitter ) {

							this.app.service( '/logs' ).create( { type: 'warning', message: `could not find the requested transmitter identifier. discarding` } );
							return;

						}

						// record the new data linked to the transmitter found
						this.app.service( '/logs' ).create( { message: `found the transmitter identifier requested: ${transmitter.name}` } );
						this._recordNewData( data, transmitter );

					} );

				}

			}


		} );

	}

    /**
	 * check data validity
	 *
	 * @param {Array} data
	 *
	 * @author shad
     */
	_dataIsValid( data ) {

		// if type of data isn't find in the permitted list of type
		if( !defaults.types[ data.type ] ) {

			this.app.service( '/logs' ).create( { type: 'warning', message: `port has received data but could not find a type match` } );
			return;

		}

		this.app.service( '/logs' ).create( { message: `port has received properly formatted data of type ${defaults.types[ data.type ]}` } );
		return true;

	}

    /**
	 * find transmitter by ID
	 *
	 * @param {integer} data
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
		.then( res => {

			this.app.service( '/logs' ).create( { message: `port has recorded new data on: ${transmitter.name}` } );

		} )
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

			this.app.service( '/logs' ).create( { type: 'error', message: `port has failed to parse JSON data: ${str}` } );

			return false;

		}

	}

    /**
	 * check if the received data is a setup data
	 * 
	 * @param {String} data
	 * 
	 * @return {Boolean}
	 * 
	 * @author shad
	 */
	_isSetupData( data ) {

		// check if the setup boolean is there
		if ( data.setup ) {

			this.app.service( '/logs' ).create( { message: `port has received setup data: ${data}` } );
			return true;

		}

		return;
			
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

				return this.app.service( '/logs' )
					.create( { message: `setup data is an already registered transmitter with id: ${data.identifier}` } );

			}

			// if setup transmitter has already been set up for registering
			if ( setup_transmitters.length > 0 ) {

				return this.app.service( '/logs' )
					.create( { message: `setup data is an already ready to be registered transmitter with id: ${data.identifier}` } );

			}

			this.app.service( '/setup/transmitters' )
			.create( { type: data.type, identifier: data.identifier } )
			.then( () => {

				this.app.service( '/logs' ).create( { message: `port has successfully set setup data with ID: ${data.identifier}` } );

			} )
			.catch( err => {

				this.app.service( '/logs' ).create( { type: 'error', message: `error while adding a new transmitter to be setup: ${err}` } );

			} );

		} )
		.catch( err => {

			this.app.service( '/logs' ).create( { type: 'error', message: `error while setting setup data: ${err}`} );

		} );


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
     * override the create service method to provide the
     * possibility to open the serial port connection
     * 
	 * @override
     * 
	 * @author shad
     */
    create() {

		// set all events
		this._onOpenSerialPort();
		this._onSerialPortError();
		this._onSerialPortClosed();
		this._onDataReceivedSerialPort();

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
