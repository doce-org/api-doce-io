'use strict';

const debug = require( 'debug' )( 'serialport' );

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
		'HARDWARE': 'hardwares/new'
	},
	foreignkey: {
		'TEMP': 'temperature_sensor_id',
		'HUMIDITY': 'humidity_sensor_id',
		'POWER': 'power_gauge_id',
		'WATER': 'water_gauge_id'
	},
	values: {
		'TEMP': 'temperature',
		'HUMIDITY': 'humidity',
		'POWER': 'energy',
		'WATER': 'water'
	}
};

module.exports = function( app, serial ) {

	/**
	 * find hardware by ID in specified service
	 * @param {String} service
	 * @param {integer} hardware_id
	 * @return {Promise}
	 * @private
	 * @author shad
	 */
	const _findHardwareID = function( service, hardware_id ) {

		debug( `trying to find hardware id: ${hardware_id} in service: ${service}` );

		return app.services[ service ]
			.find( { query: { hardware_id } } )
			.then( results => results.length > 0 && results[ 0 ].id )
			.catch( console.error );

	}

	/**
	 * create a new hardware
	 * @param {String} type
	 * @param  {integer} hardware_id
	 * @private
	 * @author shad
	 */
	const _createNewHardware = function( type, hardware_id ) {

		const service = defaults.services[ 'HARDWARE' ];

		debug( `registering a new hardware with id: ${hardware_id}` );

		app.services[ service ].create( { type, hardware_id } )
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
	const _recordNewData = function( service, data, id ) {

		const foreignkey = defaults.foreignkey[ data[ 0 ] ];
		const value = defaults.values[ data[ 0 ] ];
		service = `${service}/records`;

		debug( `record new data: ${data[2]} in service: ${service}`);

		app.services[ service ].create( { [ foreignkey ]: id, [ value ]: data[ 2 ] } )
			.then( res => debug( `new data: added in service: ${service}` ) )
			.catch( console.error );

	}

	/**
	 * handle receiving data
	 * @param {Object} serial
	 * @author shad
	 */
	serial.on( 'data', data => {

	        debug( `receiving data => ${data}` );

	        // data format: <TYPE>;<HARDWARE_ID>;<VALUE>
	        const split_data = data.split( ';' );

	        if( split_data.length > 1 ) {

	        	const service = defaults.services[ split_data [ 0 ] ];

	        	if( service ) {

	        		_findHardwareID( service, split_data[ 1 ] )
	        			.then( id => {
	        				id
	        					? _recordNewData( service, split_data, id )
	        					: _createNewHardware( split_data[ 0 ], split_data[ 1 ] );
	        			} );

	        	}

	        }

	    }
	);


}
