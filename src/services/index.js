'use strict';

const knex = require( 'knex' );
const room = require( './room' );
const roomIcon = require( './room_icon' );
const temperatureSensor = require( './temperature_sensor' );
const temperatureSensorRecord = require( './temperature_sensor_record' );
const temperatureSensorCalculation = require( './temperature_sensor_calculation' );
const humiditySensor = require( './humidity_sensor' );
const humiditySensorRecord = require( './humidity_sensor_record' );
const powerGauge = require( './power_gauge' );
const powerGaugeRecord = require( './power_gauge_record' );
const waterGauge = require( './water_gauge' );
const waterGaugeRecord = require( './water_gauge_record' );
const newHardware = require( './new_hardware' );

module.exports = function () {
    const app = this;

    const knex_connection = knex( {
        client: 'pg',
        connection: app.get( 'postgres' )[ app.get( 'env' ) ]
    } );
    app.set( 'knex', knex_connection );

    app.configure( room );
    app.configure( roomIcon );

    // temperature
    app.configure( temperatureSensor );
    app.configure( temperatureSensorRecord );
    app.configure( temperatureSensorCalculation );

    // humidity
    app.configure( humiditySensor );
    app.configure( humiditySensorRecord );

    // power
    app.configure( powerGauge );
    app.configure( powerGaugeRecord );

    // water
    app.configure( waterGauge );
    app.configure( waterGaugeRecord );

    // hardware
    app.configure( newHardware );

};
