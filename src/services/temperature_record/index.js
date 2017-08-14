'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'temperatures_records'
    };

    // Initialize our service with any options it requires
    app.use( '/hardwares/temperatures/records', service( options ) );

    const Service = app.service( '/hardwares/temperatures/records' );
    Service.before( hooks.before );
    Service.after( hooks.after );

};
