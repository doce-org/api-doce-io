'use strict';

exports.up = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.createTable( 'receivers', table => {
			table.increments( 'id' ).primary();
            table.integer( 'room_id' ).notNullable().references( 'id' ).inTable( 'rooms' ).index().onDelete( 'CASCADE' );
            table.string( 'identifier' ).notNullable();
			table.string( 'type' ).notNullable();
            table.string( 'name' ).notNullable();
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} )

    ] );

};

exports.down = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.dropTable( 'receivers' )

    ] );

};
