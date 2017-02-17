'use strict';

const service = require( './connection.service.extend' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'connections'
    };

    // Initialize our service with any options it requires
    app.use( '/connections', service( options ) );

    const connectionService = app.service( '/connections' );
    connectionService.before( hooks.before );
    connectionService.after( hooks.after );

};
