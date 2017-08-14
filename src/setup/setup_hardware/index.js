'use strict';

const memory = require('feathers-memory');
const hooks = require( './hooks' );

module.exports = function () {

    const app = this;

    // Initialize our service with any options it requires
    app.use( '/setup/hardwares', memory() ); 

    const setupService = app.service( '/setup/hardwares' );
    setupService.before( hooks.before );
    setupService.after( hooks.after );

};
