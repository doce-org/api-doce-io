'use strict';

exports.up = function( knex, Promise ) {

	return Promise.all( [

		knex.schema.createTable( 'temperatures_sensors_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' );
			table.decimal( 'temperature' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

		knex.schema.createTable( 'humidities_sensors_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' );
			table.decimal( 'temperature' ).notNullable();
			table.decimal( 'humidity' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

		knex.schema.createTable( 'powers_meters_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' );
			table.decimal( 'power' ).notNullable().defaultTo( 0 );
			table.integer( 'energy' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

		knex.schema.createTable( 'waters_meters_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'hardware_id' ).notNullable().references( 'id' ).inTable( 'hardwares' );
			table.decimal( 'water' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} )

	] );


};

exports.down = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.dropTable( 'temperatures_sensors_records' ),
        knex.schema.dropTable( 'humidities_sensors_records' ),
        knex.schema.dropTable( 'powers_meters_records' ),
        knex.schema.dropTable( 'waters_meters_records' )

    ] );

};
