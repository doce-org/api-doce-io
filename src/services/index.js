'use strict';

const knex = require( 'knex' );
// ports
const serial = require( './serial' );
// rooms
const room = require( './room' );
// hardwares
const hardware = require( './hardware' );
const temperatureRecord = require( './temperature_record' );
const temperatureAverage = require( './temperature_average' );
const humidityRecord = require( './humidity_record' );
const humidityAverage = require( './humidity_average' );
const powerRecord = require( './power_record' );
const waterRecord = require( './water_record' );
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

	// hardwares
	app.configure( hardware );
    app.configure( temperatureAverage );
    app.configure( temperatureRecord );
    app.configure( humidityAverage );
    app.configure( humidityRecord );
    app.configure( powerRecord );
    app.configure( waterRecord );

	// others
	app.configure( log );

};
