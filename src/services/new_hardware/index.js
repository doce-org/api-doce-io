'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'new_hardwares'
    };

    // Initialize our service with any options it requires
    app.use( '/hardwares/new', service( options ) );

    const sensorService = app.service( '/hardwares/new' );
    sensorService.before( hooks.before );
    sensorService.after( hooks.after );

};
