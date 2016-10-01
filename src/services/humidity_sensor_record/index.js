'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'humidities_sensors_records'
    };

    // Initialize our service with any options it requires
    app.use( '/humidities/sensors/records', service( options ) );

    const sensorsDataService = app.service( '/humidities/sensors/records' );
    sensorsDataService.before( hooks.before );
    sensorsDataService.after( hooks.after );
    
};
