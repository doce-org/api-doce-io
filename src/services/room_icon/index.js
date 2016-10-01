'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'rooms_icons'
    };

    // Initialize our service with any options it requires
    app.use( '/rooms/icons', service( options ) );

    const room_iconService = app.service( '/rooms/icons' );
    room_iconService.before( hooks.before );
    room_iconService.after( hooks.after );

};
