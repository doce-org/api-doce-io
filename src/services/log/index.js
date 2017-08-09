'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'logs',
        paginate: {
            default: 5,
            max: 25
        }
    };

    // Initialize our service with any options it requires
    app.use( '/logs', service( options ) );

    const logService = app.service( '/logs' );
    logService.before( hooks.before );
    logService.after( hooks.after );

    // set a globally accessible function to log messages
    app.set( 'log', ( message, type = 'info' ) => {

        app
		.service( '/logs' )
		.create( { type, message } );

    } );

};
