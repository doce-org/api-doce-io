'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'powers_gauges'
    };

    // Initialize our service with any options it requires
    app.use( '/powers/gauges', service( options ) );

    const sensorService = app.service( '/powers/gauges' );
    sensorService.before( hooks.before );
    sensorService.after( hooks.after );

};
