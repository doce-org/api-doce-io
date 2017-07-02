'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'transmitters_powers_records'
    };

    // Initialize our service with any options it requires
    app.use( '/transmitters/powers/records', service( options ) );

    const transmitterPowerRecordService = app.service( '/transmitters/powers/records' );
    transmitterPowerRecordService.before( hooks.before );
    transmitterPowerRecordService.after( hooks.after );

};
