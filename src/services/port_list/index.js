'use strict';

const service = require( './port_list.service.extend' );
const hooks = require( './hooks' );

module.exports = function () {

    const app = this;

    // Initialize our service with any options it requires
    app.use( '/ports/list', service() );

    const portListService = app.service( '/ports/list' );
    portListService.before( hooks.before );
    portListService.after( hooks.after );

};
