'use strict';

const knex = require( 'knex' );

const port = require( './port' );
const hardware = require( './hardware' );
const connection = require( './connection' );
const room = require( './room' );
const roomIcon = require( './room_icon' );
const temperatureSensorRecord = require( './temperature_sensor_record' );
const humiditySensorRecord = require( './humidity_sensor_record' );
const powerGaugeRecord = require( './power_gauge_record' );
const waterGaugeRecord = require( './water_gauge_record' );
const temperatureSensorCalculation = require( './temperature_sensor_calculation' );

module.exports = function () {
    const app = this;

    const knex_connection = knex( {
        client: 'pg',
        connection: app.get( 'postgres' )[ app.get( 'env' ) ]
    } );
    app.set( 'knex', knex_connection );

    // base
    app.configure( port );
    app.configure( hardware );
    app.configure( connection );

    // room
    app.configure( room );
    app.configure( roomIcon );

    // hardware
    app.configure( temperatureSensorRecord );
    app.configure( humiditySensorRecord );
    app.configure( powerGaugeRecord );
    app.configure( waterGaugeRecord );

    // calculations
    app.configure( temperatureSensorCalculation );

};
