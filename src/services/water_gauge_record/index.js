'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'waters_gauges_records'
    };

    // Initialize our service with any options it requires
    app.use( '/waters/gauges/records', service( options ) );

    const sensorService = app.service( '/waters/gauges/records' );
    sensorService.before( hooks.before );
    sensorService.after( hooks.after );

};
