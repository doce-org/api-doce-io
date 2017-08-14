'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function(){

    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'records_temperatures_averages_last_24_hours'
    };

    // Initialize our service with any options it requires
    app.use( '/views/records/temperatures/avg/last/24/hours', service( options ) );

    const recordTemperatureAvgLast24HoursView = app.service( '/views/records/temperatures/avg/last/24/hours' );
    recordTemperatureAvgLast24HoursView.before( hooks.before );
    recordTemperatureAvgLast24HoursView.after( hooks.after );

};
