'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'powers_gauges_records'
    };

    // Initialize our service with any options it requires
    app.use( '/powers/gauges/records', service( options ) );

    const sensorsDataService = app.service( '/powers/gauges/records' );
    sensorsDataService.before( hooks.before );
    sensorsDataService.after( hooks.after );
    
};
