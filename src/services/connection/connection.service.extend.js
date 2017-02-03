'use strict';

const Service = require( 'feathers-knex' ).Service;
const serialport = require( 'serialport' );
const debug = require( 'debug' )( 'serialport' );
const _ = require( 'lodash' );

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

class ExtendedService extends Service {

    setup( app ) {
        this.app = app;
    }

    /**
	 * find hardware by ID
	 * @param {integer} data
	 * @return {Promise}
	 * @private
	 * @author shad
	 */
	_findHardwarePk = function( data ) {

		debug( `trying to find hardware id: ${data.hardware_id}` );

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
	_createNewHardware = function( data, port_id ) {

		debug( `registering a new hardware with id: ${data.hardware_id}` );

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
	_recordNewData = function( data, id ) {

        let service = defaults.service[ data.type ];
		const value = defaults.values[ data.type ];
		service = `${service}/records`;

		debug( `record new data: ${data.value} in service: ${service}`);

		app.services[ service ].create( { hardware_id: id, [ value ]: data.value } )
			.then( res => debug( `new data: added in service: ${service}` ) )
			.catch( console.error );

	}

    /**
     * check data validity
     * @param {Array} data
	 * @author shad
     */
    _checkDataValidity( data ) {

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

    /**
     * handle opening the serial connection
     * @param {Object} serial
	 * @param {Object} port
	 * @author shad
     */
    _serialopen( serial, port ) {

        serial.on( 'open', {

            debug( `port open: ${port.name}` );

            // create connection in database
            return this.table.create( { port_id: port.id } )
                .then( res => res )
                .catch( console.error );

        } );

    }

    /**
	 * handle receiving data through the serial connection
	 * @param {Object} serial
	 * @param {Object} port
	 * @author shad
	 */
    _serialdata( serial, port ) {
        const format = [ 'type', 'hardware_id', 'value' ];

        serial.on( 'data', data => {

    	    debug( `receiving data => ${data}` );

    	    // data format: <TYPE>;<HARDWARE_ID>;<VALUE>
    	    const split_data = data.split( ';' );
            const data_obj = _.zipObject( format, split_data );
    	    const dataIsValid = this._checkDataValidity( data_obj );

            if( dataIsValid ) {

                _findHardwarePk( data_obj ).then( id => {

                    if( id ) {
                        this._recordNewData( data_obj, id );
                    }
                    else {
                        this._createNewHardware( data_obj, port.id );
                    }

                } );

    	    }

    	}

    }

    /**
     * handle error on the serial connection
     * @param {Object} serial
	 * @param {Object} port
	 * @author shad
     */
    _serialerror( serial, port ) {

        serial.on( 'error', err => {

    		console.error( `error: ${err}` );

    	} );

    	serial.on( 'disconnect', message =>  {

    		console.error( `disconnected: ${message}` ) ;

    	} );

    }

    /**
     * handle closing the serial connection
     * @param {Object} serial
	 * @param {Object} port
	 * @author shad
     */
    _serialclose( serial, data ) {

        serial.on( 'close', () => {

            debug( `port open: ${data.name}` );

        } );

    }

    /**
     * override the create service method
     * @param {Object} data
	 * @param {Object} params
	 * @override
	 * @author shad
     */
    create( data, params ) {

        const serial = new serialport.SerialPort( data.com_name, {
    	    baudrate: 115200,
    	    parser: serialport.parsers.readline( '\r\n' )
    	} );

        this._serialopen( serial, data );
    	this._serialdata( serial, data );
    	this._serialerror( serial, data );
        this._serialclose( serial, data );

    }

}

module.exports = function init( Model ) {
  return new ExtendedService( Model );
};
