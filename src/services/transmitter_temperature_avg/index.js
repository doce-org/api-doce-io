'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'transmitters_temperatures_averages'
    };

    // Initialize our service with any options it requires
    app.use( '/transmitters/temperatures/averages', service( options ) );

    const transmitterTemperatureAverageService = app.service( '/transmitters/temperatures/averages' );
    transmitterTemperatureAverageService.before( hooks.before );
    transmitterTemperatureAverageService.after( hooks.after );

};
