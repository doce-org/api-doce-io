'use strict';

exports.up = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.createTable( 'transmitters', table => {
			table.increments( 'id' ).primary();
            table.integer( 'room_id' ).notNullable().references( 'id' ).inTable( 'rooms' );
            table.string( 'identifier' ).notNullable();
			table.string( 'type' ).notNullable();
            table.string( 'name' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

        knex.schema.createTable( 'transmitters_temperatures_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'transmitter_id' ).notNullable().references( 'id' ).inTable( 'transmitters' );
			table.decimal( 'temperature' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

		knex.schema.createTable( 'transmitters_humidities_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'transmitter_id' ).notNullable().references( 'id' ).inTable( 'transmitters' );
			table.decimal( 'temperature' ).notNullable();
			table.decimal( 'humidity' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

		knex.schema.createTable( 'transmitters_powers_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'transmitter_id' ).notNullable().references( 'id' ).inTable( 'transmitters' );
			table.decimal( 'power' ).notNullable().defaultTo( 0 );
			table.integer( 'pulse' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

		knex.schema.createTable( 'transmitters_waters_records', table => {
			table.increments( 'id' ).primary();
			table.integer( 'transmitter_id' ).notNullable().references( 'id' ).inTable( 'transmitters' );
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
        knex.schema.dropTable( 'waters_meters_records' ),
        knex.schema.dropTable( 'hardwares' )

    ] );

};
