'use strict';

const cronjob = require( 'cron' ).CronJob;

module.exports = function() {

    const app = this;
    const log = app.get( 'log' );
    const knex = app.get( 'knex' );

    // cronJobs

    // every 3 minutes (days stats)
    new cronjob( '0 */3 * * * *', () => {

        return Promise.all( [

            knex.schema.raw( 'SELECT * FROM fn_calculate_avg_temperature(:interval, :type)', { interval: '3 minutes', type: 'day' } ),
            knex.schema.raw( 'SELECT * FROM fn_calculate_avg_humidity(:interval, :type)', { interval: '3 minutes', type: 'day' } )

        ] )
        .then( () => {

            log( `insert new average values for day statistics (every 3 minutes) successfully` );

        } )
        .catch( err => {

            log( `failed to insert average statistics data for 'day - every 3 minutes': ${err.toString()}`, 'error' );

        } );

    }, false, true );

    // every 10 minutes (weeks stats)
    new cronjob( '0 */10 * * * *', () => {

        return Promise.all( [

            knex.schema.raw( 'SELECT * FROM fn_calculate_avg_temperature(:interval, :type)', { interval: '10 minutes', type: 'week' } ),
            knex.schema.raw( 'SELECT * FROM fn_calculate_avg_humidity(:interval, :type)', { interval: '10 minutes', type: 'week' } )

        ] )
        .then( () => {

            log( `insert new average values for week statistics (every 10 minutes) successfully` );

        } )
        .catch( err => {

            log( `failed to insert average statistics data for 'week - every 10 minutes': ${err.toString()}`, 'error' );

        } );

    }, false, true );

    // every day at 00:01 am (months stats)
    new cronjob( '0 1 0 * * *', () => {

        return Promise.all( [

            knex.schema.raw( 'SELECT * FROM fn_calculate_avg_temperature(:interval, :type)', { interval: '1 day', type: 'month' } ),

        ] )
        .then( () => {

            log( `insert new average values for month statistics (every day at 00:01am) successfully` );

        } )
        .catch( err => {

            log( `failed to insert average statistics data for 'month - every day at 00:01am': ${err.toString()}`, 'error' );

        } );

    }, false, true );

    // every first day of the month at 00:01 am (years stats)
    new cronjob( '0 1 0 1 * *', () => {

        return Promise.all( [

            knex.schema.raw( 'SELECT * FROM fn_calculate_avg_temperature(:interval, :type)', { interval: '1 month', type: 'year' } ),

        ] )
        .then( () => {

            log( `insert new average values for year statistics (every first day of the month at 00:01am) successfully` );

        } )
        .catch( err => {

            log( `failed to insert average statistics data for 'year - every first day of the month at 00:01am': ${err.toString()}`, 'error' );

        } );

    }, false, true );

};