'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'waters_gauges'
    };

    // Initialize our service with any options it requires
    app.use( '/waters/gauges', service( options ) );

    const sensorService = app.service( '/waters/gauges' );
    sensorService.before( hooks.before );
    sensorService.after( hooks.after );

};
