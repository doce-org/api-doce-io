'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'rooms'
    };

    // Initialize our service with any options it requires
    app.use( '/rooms', service( options ) );

    const roomService = app.service( '/rooms' );
    roomService.before( hooks.before );
    roomService.after( hooks.after );
    
};
