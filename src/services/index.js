'use strict';

const knex = require( 'knex' );
// ports
const serial = require( './serial' );
const setupHardware = require( './setup_hardware' );
// hardwares
const hardware = require( './hardware' );
// rooms
const room = require( './room' );
// sensors
const temperatureSensorRecord = require( './temperature_sensor_record' );
const humiditySensorRecord = require( './humidity_sensor_record' );
const powerMeterRecord = require( './power_meter_record' );
const waterMeterRecord = require( './water_meter_record' );
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
    app.configure( setupHardware );

	// hardware
	app.configure( hardware );

	// room
    app.configure( room );

    // hardware
    app.configure( temperatureSensorRecord );
    app.configure( humiditySensorRecord );
    app.configure( powerMeterRecord );
    app.configure( waterMeterRecord );

	// others
	app.configure( log );

};
