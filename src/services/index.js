'use strict';

const knex = require( 'knex' );
// ports
const serial = require( './serial' );
// rooms
const room = require( './room' );
// transmitters
const transmitter = require( './transmitter' );
const transmitterTemperatureRecord = require( './transmitter_temperature_record' );
const transmitterTemperatureAverage = require( './transmitter_temperature_avg' );
const transmitterHumidityRecord = require( './transmitter_humidity_record' );
const transmitterHumidityAverage = require( './transmitter_humidity_avg' );
const transmitterPowerRecord = require( './transmitter_power_record' );
const transmitterWaterRecord = require( './transmitter_water_record' );
// receivers
const receiver = require( './receiver' );
// others
const log = require( './log' );

module.exports = function () {
    const app = this;

    const knex_connection = knex( {
        client: 'pg',
        connection: app.get( 'postgres' )
    } );
    app.set( 'knex', knex_connection );

    // base
    app.configure( serial );
	
    // room
    app.configure( room );

	// transmitters
	app.configure( transmitter );
    app.configure( transmitterTemperatureAverage );
    app.configure( transmitterTemperatureRecord );
    app.configure( transmitterHumidityAverage );
    app.configure( transmitterHumidityRecord );
    app.configure( transmitterPowerRecord );
    app.configure( transmitterWaterRecord );

    // receiver
    app.configure( receiver );
    
	// others
	app.configure( log );

};
