'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'waters_records'
    };

    // Initialize our service with any options it requires
    app.use( '/hardwares/waters/records', service( options ) );

    const Service = app.service( '/hardwares/waters/records' );
    Service.before( hooks.before );
    Service.after( hooks.after );

};
