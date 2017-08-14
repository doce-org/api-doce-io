'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function(){

    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'last_records_per_hardwares'
    };

    // Initialize our service with any options it requires
    app.use( '/views/records/last/per/hardwares', service( options ) );

    const lastRecordPerHardwareView = app.service( '/views/records/last/per/hardwares' );
    lastRecordPerHardwareView.before( hooks.before );
    lastRecordPerHardwareView.after( hooks.after );

};
