'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'ports'
    };

    // Initialize our service with any options it requires
    app.use( '/ports', service( options ) );

    const portService = app.service( '/ports' );
    portService.before( hooks.before );
    portService.after( hooks.after );

};
