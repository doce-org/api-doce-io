'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'transmitters_waters_records'
    };

    // Initialize our service with any options it requires
    app.use( '/transmitters/waters/records', service( options ) );

    const transmitterWaterRecordService = app.service( '/transmitters/waters/records' );
    transmitterWaterRecordService.before( hooks.before );
    transmitterWaterRecordService.after( hooks.after );

};
