'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'temperatures_sensors'
    };

    // Initialize our service with any options it requires
    app.use( '/temperatures/sensors', service( options ) );

    const sensorService = app.service( '/temperatures/sensors' );
    sensorService.before( hooks.before );
    sensorService.after( hooks.after );

};
