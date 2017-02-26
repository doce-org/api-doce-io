'use strict';

const knex = require( 'knex' );

// ports
const port = require( './port' );
const portList = require( './port_list' );
const connection = require( './connection' );

// hardwares
const hardware = require( './hardware' );

// rooms
const room = require( './room' );

// sensors
const temperatureSensorRecord = require( './temperature_sensor_record' );
const humiditySensorRecord = require( './humidity_sensor_record' );
const powerMeterRecord = require( './power_meter_record' );
const waterMeterRecord = require( './water_meter_record' );

// calculations
const temperatureSensorCalculation = require( './temperature_sensor_calculation' );

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
    app.configure( port );
    app.configure( portList );
    app.configure( connection );

	// hardware
	app.configure( hardware );

	// room
    app.configure( room );

    // hardware
    app.configure( temperatureSensorRecord );
    app.configure( humiditySensorRecord );
    app.configure( powerMeterRecord );
    app.configure( waterMeterRecord );

    // calculations
    app.configure( temperatureSensorCalculation );

	// others
	app.configure( log );

};
