'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'temperatures_sensors_calculations'
    };

    // Initialize our service with any options it requires
    app.use( '/temperatures/sensors/calculations', service( options ) );

    const sensorService = app.service( '/temperatures/sensors/calculations' );
    sensorService.before( hooks.before );
    sensorService.after( hooks.after );

};
