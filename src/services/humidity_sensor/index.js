'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'humidities_sensors'
    };

    // Initialize our service with any options it requires
    app.use( '/humidities/sensors', service( options ) );

    const sensorService = app.service( '/humidities/sensors' );
    sensorService.before( hooks.before );
    sensorService.after( hooks.after );

};
