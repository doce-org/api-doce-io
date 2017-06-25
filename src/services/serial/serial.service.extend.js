'use strict';

const serialport = require( 'serialport' );

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
		'TEMP': '/temperatures/sensors/records',
		'HUMIDITY': '/humidities/sensors/records',
		'POWER': '/powers/meters/records',
		'WATER': '/waters/meters/records'
	},

	types: {
		'TEMP': 'temperature',
		'HUMIDITY': 'humidity',
		'POWER': 'energy',
		'WATER': 'water'
	}

};

class Service {

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

			this.app.service( '/logs' ).create( { message: `port open` } );

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

					// find the requested hardware based on a given identifier and the type of the record
					this._findHardwarePk( data ).then( hardware => {

						// if none was found, no hardware of the requested identifier exist. exiting
						if ( !hardware ) {

							this.app.service( '/logs' ).create( { type: 'warning', message: `could not find the requested hardware identifier. discarding` } );
							return;

						}

						// record the new data linked to the hardware found
						this.app.service( '/logs' ).create( { message: `found the hardware identifier requested: ${hardware.name}` } );
						this._recordNewData( data, hardware );

					} );

				}

			}


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
			this.app.service( '/logs' ).create( { message: `port connection error: ${err}` } );

		} );

		this.serial.on( 'disconnect', message =>  {

			// log
			this.app.service( '/logs' ).create( { message: `port disconnected: ${message}` } );

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
	 * find hardware by ID
	 *
	 * @param {integer} data
	 *
     * @return {Promise}
	 *
	 * @private
	 *
	 * @author shad
	 */
	_findHardwarePk( data ) {

		// prepare the request query
		const query = { query: {

			// find the hardware id
			'identifier': data.identifier,

			// type has to be the one requested
			'type': defaults.types[ data.type ]

		} };

		return this.app.service( '/hardwares' )
		.find( query )
		.then( results => results.length > 0 && results[ 0 ] )
		.catch( console.error );

	}

    /**
	 * record new data in specified service
	 *
	 * @param {Array} data
	 * @param {Object} hardware
	 *
	 * @private
	 *
	 * @author shad
	 */
	_recordNewData( data, hardware ) {

		// get the service on which to save the new record
		const service = defaults.services[ data.type ];

		// extract only the data to be recorded by removing the type and the
		// hardware identifier which aren't needed, everything else has to be
		// part of the requested service model ( temperature, power... )
		let values = _.omit( data, [ 'type', 'identifier' ] );

		// add to the required data the hardware id previously found in `_findHardwarePk`
		values = Object.assign( {}, { hardware_id: hardware.id }, values );

		return this.app.service( service )
		.create( values )
		.then( res => {

			this.app.service( '/logs' ).create( { message: `port has recorded new data on: ${hardware.name}` } );

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
	 * set a temporary setup data for a hardware to be registered
	 * 
	 * @param {String} str
	 * 
	 * @author shad
	 */
	_setSetupData( str ) {

		this.app.service( '/logs' ).create( { message: `port has successfully set setup data: ${str}` } );

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

		if ( !this.serial ) {

			// set all events
			this._onOpenSerialPort();
			this._onSerialPortError();
			this._onSerialPortClosed();
			this._onDataReceivedSerialPort();

		}

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
