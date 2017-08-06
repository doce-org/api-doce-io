'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'transmitters_humidities_avg'
    };

    // Initialize our service with any options it requires
    app.use( '/transmitters/humidities/averages', service( options ) );

    const transmitterHumidityAverageService = app.service( '/transmitters/humidities/averages' );
    transmitterHumidityAverageService.before( hooks.before );
    transmitterHumidityAverageService.after( hooks.after );

};
