'use strict';

const service = require( 'feathers-knex' );
const hooks = require( './hooks' );

module.exports = function(){
    
    const app = this;

    const options = {
        Model: app.get( 'knex' ),
        name: 'transmitters_humidities_avg_detailed'
    };

    // Initialize our service with any options it requires
    app.use( '/views/transmitters/humidities/avg/detailed', service( options ) );

    const transmitterHumidityAvgDetailedView = app.service( '/views/transmitters/humidities/avg/detailed' );
    transmitterHumidityAvgDetailedView.before( hooks.before );
    transmitterHumidityAvgDetailedView.after( hooks.after );

};
