'use strict';

exports.up = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.createTable( 'ports', table => {
			table.increments( 'id' ).primary();
            table.string( 'name' ).notNullable();
            table.string( 'com_name' ).notNullable();
            table.string( 'manufacturer' ).notNullable();
            table.string( 'serial_number' ).notNullable();
            table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
			table.timestamp( 'updated_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

        knex.schema.createTable( 'hardwares', table => {
			table.increments( 'id' ).primary();
            table.integer( 'port_id' ).notNullable().references( 'id' ).inTable( 'ports' );
			table.string( 'hardware_id' ).notNullable();
			table.string( 'type' ).notNullable();
            table.string( 'name' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} ),

        knex.schema.createTable( 'connections', table => {
            table.increments( 'id' ).primary();
            table.integer( 'port_id' ).notNullable().references( 'id' ).inTable( 'ports' );
            table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
        } );

    ] );

};

exports.down = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.dropTable( 'hardwares' ),
        knex.schema.dropTable( 'connections' ),
		knex.schema.dropTable( 'ports' )

    ] );

};
