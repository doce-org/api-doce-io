'use strict';

const cron = require( 'node-cron' );
const moment = require( 'moment' );
const _ = require( 'lodash' );

module.exports = function() {
	const app = this;

	/**
	 * get listing of available sensors
	 * @param {app} Object
	 * @return {Array}
	 * @private
	 * @author shad
	 */
	const _getAvailableSensors = function( app ) {

		const temperatureSensorService = app.services[ 'temperatures/sensors' ];

		return new Promise( resolve => {
			temperatureSensorService.find()
				.then( sensors => resolve( sensors ) )
				.catch( console.error );
		} );

	};

	/**
	 * get sensors records base on given parameters
	 * @param {app} Object
	 * @param  {integer} temperature_sensor_id
	 * @param  {Date} start
	 * @param  {Date} end
	 * @return {Array}
	 * @private
	 * @author shad
	 */
	const _getSensorRecords = function( app, temperature_sensor_id, start, end ) {

		const temperatureSensorRecordService = app.services[ 'temperatures/sensors/records' ];

		return new Promise( resolve => {
			temperatureSensorRecordService.find( { 
					query: { 
						temperature_sensor_id, 
						created_at: { $gte: start, $lte: end } 
					}
			 	} )
				.then( records => resolve( records ) )
				.catch( console.error );
		} );

	};

	/**
	 * calculate max, min and average of the results
	 * @param {Array} records
	 * @return {Object}
	 * @private
	 * @author shad
	 */
	const _resultsCalculations = function( records ) {

		let values, lowest, highest, average;

		values = records.map( record => +record.temperature );

		lowest = Math.min.apply( null, values );
		highest = Math.max.apply( null, values );

		average = values.reduce( ( prev, cur ) => prev + cur, 0 ) / values.length;

		return { lowest, highest, average };

	};

	/**
	 * calculate hour average temperature
	 * each hour at *:01
	 * @author shad
	 */
	cron.schedule( '1 * * * *', () => {

		// subtract an hour to get the proper time
		let now = moment().subtract( 1, 'hour' ), 
			start = now.startOf( 'hour' ).toDate(), 
			end = now.endOf( 'hour' ).toDate();
		
		// list of available sensors
		_getAvailableSensors( app ).then( sensors => {

			sensors.forEach( sensor => {

				// list records on specified sensor
				_getSensorRecords( app, sensor.id, start, end )
					.then( records => {

						if( records.length > 0 ) {
							let calc = _resultsCalculations( records );
							calc = Object.assign( 
								{}, calc, 
								{ start, end, type: 'hour', temperature_sensor_id: sensor.id } 
							);

							app.services[ 'temperatures/sensors/calculations' ].create( calc )
								.catch( console.error );
						}

					} )

			} );

		} );


	} );

}