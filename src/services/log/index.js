'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'logs'
    };

    // Initialize our service with any options it requires
    app.use( '/logs', service( options ) );

    const logService = app.service( '/logs' );
    logService.before( hooks.before );
    logService.after( hooks.after );

};