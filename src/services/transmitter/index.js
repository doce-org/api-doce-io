'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'transmitters'
    };

    // Initialize our service with any options it requires
    app.use( '/transmitters', service( options ) );

    const transmitterService = app.service( '/transmitters' );
    transmitterService.before( hooks.before );
    transmitterService.after( hooks.after );

};
