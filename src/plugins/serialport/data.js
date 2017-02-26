'use strict';

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

/**
 * handle receiving data from an open connection
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

		/**
		 * check data validity
		 *
		 * @param {Array} data
		 *
		 * @author shad
		 */
		const _checkDataValidity = function( data ) {

			// if type of data isn't find in the permitted list of type
			if( !defaults.types[ data.type ] ) {

				app.service( '/logs' ).create( { type: 'warning', message: `port ${port.name} has received data but could not find a type match` } );
				return;

			}

			app.service( '/logs' ).create( { message: `port ${port.name} has received properly formatted data of type ${defaults.types[ data.type ]}` } );
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
		const _findHardwarePk = function( data ) {

			// prepare the request query
			const query = { query: {

				// find the hardware id
				'identifier': data.identifier,

				// type has to be the one requested
				'type': defaults.types[ data.type ]

			} };

			return app.service( '/hardwares' )
			.find( query )
			.then( results => results.length > 0 && results[ 0 ] )
			.catch( console.error );

		}

		/**
		 * record new data in specified service
		 *
		 * @param {Object} port
		 * @param {Array} data
		 * @param {Object} hardware
		 *
		 * @private
		 *
		 * @author shad
		 */
		const _recordNewData = function( port, data, hardware ) {

			// get the service on which to save the new record
			const service = defaults.services[ data.type ];

			// extract only the data to be recorded by removing the type and the
			// hardware identifier which aren't needed, everything else has to be
			// part of the requested service model ( temperature, power... )
			let values = _.omit( data, [ 'type', 'identifier' ] );

			// add to the required data the hardware id previously found in `_findHardwarePk`
			values = Object.assign( {}, { hardware_id: hardware.id }, values );

			return app.service( service )
			.create( values )
			.then( res => {

				app.service( '/logs' ).create( { message: `port ${port.name} has recorded new data on: ${hardware.name}` } );

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
		const _isJSON = function( str ) {

			try {

				const result = JSON.parse( str );
				return result;

			}

			catch (e) {

				return false;

			}

		}


		serial.on( 'data', raw_data => {

			app.service( '/logs' ).create( { message: `port ${port.name} is receiving data: ${raw_data}` } );

			// test received data is actually a valid JSON while
			// parsing and returning the parsed result or false
			const data = _isJSON( raw_data );
			
			if ( data ) {

				// check data validity so we don't record malformed data
				const data_is_valid = _checkDataValidity( data );

				if ( data_is_valid ) {

					// find the requested hardware based on a given identifier and the type of the record
					_findHardwarePk( data ).then( hardware => {

						// if none was found, no hardware of the requested identifier exist. exiting
						if ( !hardware ) {

							app.service( '/logs' ).create( { type: 'warning', message: `could not find the requested hardware identifier. discarding` } );
							return;

						}

						// record the new data linked to the hardware found
						app.service( '/logs' ).create( { message: `found the hardware identifier requested: ${hardware.name}` } );
						_recordNewData( port, data, hardware );

					} );

				}

			}


		} );

	};

};
