'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'receivers'
    };

    // Initialize our service with any options it requires
    app.use( '/receivers', service( options ) );

    const receiverService = app.service( '/receivers' );
    receiverService.before( hooks.before );
    receiverService.after( hooks.after );

};
