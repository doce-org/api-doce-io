'use strict';

const service = require( './connection.service.extend' );
const memory = require('feathers-memory');
const hooks = require( './hooks' );

module.exports = function () {

    const app = this;

    // Initialize our service with any options it requires
    app.use( '/connections', memory() );

    const connectionService = app.service( '/connections' );
    connectionService.before( hooks.before );
    connectionService.after( hooks.after );

};
