'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'powers_records'
    };

    // Initialize our service with any options it requires
    app.use( '/hardwares/powers/records', service( options ) );

    const Service = app.service( '/hardwares/powers/records' );
    Service.before( hooks.before );
    Service.after( hooks.after );

};
