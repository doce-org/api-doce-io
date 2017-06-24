'use strict';

const service = require( './serial.service.extend' );
const hooks = require( './hooks' );

module.exports = function () {

    const app = this;

    // Initialize our service with any options it requires
    app.use( '/serial', service() );

    const serialService = app.service( '/serial' );
    serialService.before( hooks.before );
    serialService.after( hooks.after );

};
