'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function(){
    
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'records_humidities_avg_last_24_hours'
    };

    // Initialize our service with any options it requires
    app.use( '/views/records/humidities/avg/last/24/hours', service( options ) );

    const recordHumidityAvgLast24HoursView = app.service( '/views/records/humidities/avg/last/24/hours' );
    recordHumidityAvgLast24HoursView.before( hooks.before );
    recordHumidityAvgLast24HoursView.after( hooks.after );

};
