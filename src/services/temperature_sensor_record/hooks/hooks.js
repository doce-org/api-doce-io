'use strict';

const errors = require( 'feathers-errors' );
const _ = require( 'lodash' );

/**
 * reformat data to get the sensor data
 * @returns {Function}
 * @author shad
 */
exports.getSensorIfNeeded = function() {

	return function( hook ) {

		if ( hook.type !== 'after' ) {
			throw new errors.BadRequest( `The 'getSensorIfNeeded' hook should only be used as a 'after' hook.` );
		}

		if ( [ 'find' ].indexOf( hook.method ) === -1 ) {
			throw new errors.BadRequest( `The 'getSensorIfNeeded' hook should only be used with the find method.` );
		}

		if( hook.params.withSensor ) {

			return new Promise( ( resolve, reject ) => {

				const grouped_sensors = _.groupBy( hook.result, 'temperature_sensor_id' );

				const getSensor = function( id, data ) {
					return hook.app.service( '/estimations/sensors' ).get( id )
						.then( sensor => data.sensor = sensor );
				};

				const sensor_promise = [];
				Object.keys( grouped_sensors ).forEach( key => {
					sensor_promise.push( getSensor( key, grouped_sensors[ key ] ) );
				} );

				Promise.all( sensor_promise )
					.then( () => {
						hook.result = grouped_sensors;
						resolve( hook );
					} )
					.catch( reject );

			} );

		}

	}

};