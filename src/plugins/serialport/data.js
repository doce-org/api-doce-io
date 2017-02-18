'use strict';

const _ = require( 'lodash' );

/**
 * defaults values
 *
 * @type {Object}
 *
 * @const
 *
 * @author shad
 */
const defaults = {

	services: {
		'TEMP': 'temperatures/sensors',
		'HUMIDITY': 'humidities/sensors',
		'POWER': 'powers/gauges',
		'WATER': 'waters/gauges'
	},

	values: {
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
		const format = [ 'type', 'hardware_id', 'value' ];

		/**
		 * check data validity
		 *
		 * @param {Array} data
		 *
		 * @author shad
		 */
		const _checkDataValidity = function( data ) {

			// if type of data isn't find in the permitted list of type
			if( !defaults.values[ data.type ] ) {

				app.service( '/logs' ).create( { message: `port ${port.name} has receiving data but could not find a type match` } );
				return;

			}

			// hardware id has to have a length of 8 char.
			if( data.hardware_id.length !== 8 ) {

				app.service( '/logs' ).create( { message: `port ${port.name} has receiving a malformed hardware id` } );
				return;

			}

			app.service( '/logs' ).create( { message: `port ${port.name} has receiving properly formatted data of type ${defaults.values[ data.type ]}` } );
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
		// const _findHardwarePk = function( data ) {
		//
		// 	// debug( `trying to find hardware id: ${data.hardware_id}` );
		//
		// 	return this.app.services( '/hardwares' )
		// 		.find( { query: { hardware_id: data.hardware_id } } )
		// 		.then( results => results.length > 0 && results[ 0 ].id )
		// 		.catch( console.error );
		//
		// }

		/**
		 * create a new hardware
		 *
		 * @param {Object} data
		 * @param {String} port_id
		 *
		 * @private
		 *
		 * @author shad
		 */
		// const _createNewHardware = function( data, port_id ) {
		//
		// 	// debug( `registering a new hardware with id: ${data.hardware_id}` );
		//
		// 	this.app.services( '/hardwares' ).create( { type: data.type, hardware_id: data.hardware_id, port_id } )
		// 		.catch( console.error );
		//
		// }

		/**
		 * record new data in specified service
		 *
		 * @param {String} service
		 * @param {Array} data
		 * @param {integer} id
		 *
		 * @private
		 *
		 * @author shad
		 */
		// const _recordNewData = function( data, id ) {
		//
		// 	let service = defaults.service[ data.type ];
		// 	const value = defaults.values[ data.type ];
		// 	service = `${service}/records`;
		//
		// 	// debug( `record new data: ${data.value} in service: ${service}`);
		//
		// 	app.services[ service ].create( { hardware_id: id, [ value ]: data.value } )
		// 		.then( res => debug( `new data: added in service: ${service}` ) )
		// 		.catch( console.error );
		//
		// }


		serial.on( 'data', raw_data => {

			app.service( '/logs' ).create( { message: `port ${port.name} is receiving data: ${data}` } );

			// raw_data format: <TYPE>;<HARDWARE_ID>;<VALUE>
			const split_data = raw_data.split( ';' );

			// zip the result to a properly formatted object
			// 1 => type
			// 2 => hardware id
			// 3 => value
			const data = _.zipObject( format, split_data );

			// check data validity so we don't record malformed data
			const data_is_valid = _checkDataValidity( data );

			// if( data_is_valid ) {
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

	};

};
