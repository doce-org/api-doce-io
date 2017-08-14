'use strict';

const fs = require( 'fs' );
const sql_folder = '20161217131056_hardwares';

const create_fn_calculate_avg_temperature = fs.readFileSync(
	`${__dirname}/../sql/${sql_folder}/functions/create_fn_calculate_avg_temperature.sql` ).toString();
const create_fn_calculate_avg_humidity = fs.readFileSync(
	`${__dirname}/../sql/${sql_folder}/functions/create_fn_calculate_avg_humidity.sql` ).toString();

exports.up = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.createTable( 'hardwares', table => {
			table.increments( 'id' ).primary();
            table.integer( 'room_id' ).notNullable().references( 'id' ).inTable( 'rooms' ).onDelete( 'CASCADE' );
			table.integer( 'parent_relay_id' ).references( 'id' ).inTable( 'hardwares' ).onDelete( 'CASCADE' );
            table.string( 'identifier' ).notNullable();
			table.string( 'type' ).notNullable();
            table.string( 'name' ).notNullable();
			table.boolean( 'is_relay' ).defaultTo( false );
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

        knex.schema.createTable( 'temperatures_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' ).onDelete( 'CASCADE' );
			table.decimal( 'temperature' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );

			table.index( 'hardware_id' );
		} ),

		knex.schema.createTable( 'temperatures_averages', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' ).onDelete( 'CASCADE' );
			table.decimal( 'temperature' ).notNullable();
			table.string( 'type' ).notNullable();
			table.timestamp( 'created_at' ).notNullable();

			table.index( 'hardware_id' );
			table.index( 'type' );
			table.index( 'created_at' );
		} ),

		knex.schema.raw( create_fn_calculate_avg_temperature ),

		knex.schema.createTable( 'humidities_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' ).onDelete( 'CASCADE' );
			table.decimal( 'temperature' ).notNullable();
			table.decimal( 'humidity' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );

			table.index( 'hardware_id' );
		} ),

		knex.schema.createTable( 'humidities_averages', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' ).onDelete( 'CASCADE' );
			table.decimal( 'humidity' ).notNullable();
			table.decimal( 'temperature' ).notNullable();
			table.string( 'type' ).notNullable();
			table.timestamp( 'created_at' ).notNullable();

			table.index( 'hardware_id' );
			table.index( 'type' );
			table.index( 'created_at' );
		} ),

		knex.schema.raw( create_fn_calculate_avg_humidity ),

		knex.schema.createTable( 'powers_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' ).onDelete( 'CASCADE' );
			table.decimal( 'power' ).notNullable().defaultTo( 0 );
			table.integer( 'pulse' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );

			table.index( 'hardware_id' );
		} ),

		knex.schema.createTable( 'powers_averages', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' ).onDelete( 'CASCADE' );
			table.decimal( 'power' ).notNullable();
			table.integer( 'pulse' ).notNullable();
			table.string( 'type' ).notNullable();
			table.timestamp( 'created_at' ).notNullable();

			table.index( 'hardware_id' );
			table.index( 'type' );
			table.index( 'created_at' );
		} ),

		knex.schema.createTable( 'waters_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' ).onDelete( 'CASCADE' );
			table.decimal( 'water' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );

			table.index( 'hardware_id' );
		} ),

		knex.schema.createTable( 'waters_averages', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' ).onDelete( 'CASCADE' );
			table.decimal( 'water' ).notNullable();
			table.string( 'type' ).notNullable();
			table.timestamp( 'created_at' ).notNullable();

			table.index( 'hardware_id' );
			table.index( 'type' );
			table.index( 'created_at' );
		} )

    ] );

};

exports.down = function( knex, Promise ) {

    return Promise.all( [

		knex.schema.raw( 'DROP FUNCTION fn_calculate_avg_temperature(varchar, varchar);' ),
		knex.schema.raw( 'DROP FUNCTION fn_calculate_avg_humidity(varchar, varchar);' ),

        knex.schema.dropTable( 'temperatures_records' ),
		knex.schema.dropTable( 'temperatures_averages' ),
        knex.schema.dropTable( 'humidities_records' ),
		knex.schema.dropTable( 'humidities_averages' ),
        knex.schema.dropTable( 'powers_records' ),
        knex.schema.dropTable( 'powers_averages' ),
        knex.schema.dropTable( 'waters_records' ),
        knex.schema.dropTable( 'waters_averages' ),
        knex.schema.dropTable( 'hardwares' )

    ] );

};
