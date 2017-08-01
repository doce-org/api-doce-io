'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function(){
    
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'last_records_per_transmitters'
    };

    // Initialize our service with any options it requires
    app.use( '/views/records/last/per/transmitters', service( options ) );

    const lastRecordPerTransmitterView = app.service( '/views/records/last/per/transmitters' );
    lastRecordPerTransmitterView.before( hooks.before );
    lastRecordPerTransmitterView.after( hooks.after );

};
