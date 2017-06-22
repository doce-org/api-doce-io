'use strict';

const fs = require( 'fs' );
const sql_folder = '20170219113850_hardwares_temperatures_statistics';

const create_fn_calculate_avg_temperature = fs.readFileSync(
	`${__dirname}/../sql/${sql_folder}/functions/create_fn_calculate_avg_temperature.sql` ).toString();

exports.up = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.createTable( 'hardwares_temperatures_avg', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' );
			table.decimal( 'avg_temperature' ).notNullable();
			table.string( 'type' ).notNullable();
			table.timestamp( 'created_at' ).notNullable();

			table.index( 'hardware_id' );
			table.index( 'type' );
		} ),

		knex.schema.raw( create_fn_calculate_avg_temperature )

	] );

};

exports.down = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.raw( 'DROP FUNCTION fn_calculate_avg_temperature(varchar, varchar);' ),

		knex.schema.dropTable( 'hardwares_temperatures_avg' )

	] );

};
