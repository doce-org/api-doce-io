'use strict';

const fs = require( 'fs' );
const sql_folder = '20170725194845_last_records_views';

const create_view_last_records_per_transmitters = fs.readFileSync(
	`${__dirname}/../sql/${sql_folder}/views/create_view_last_records_per_transmitters.sql` ).toString();

exports.up = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.raw( create_view_last_records_per_transmitters )

    ] );
  
};

exports.down = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.raw( 'DROP VIEW IF EXISTS last_records_per_transmitters;' )

    ] );
  
};
