'use strict';

exports.up = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.createTable( 'logs', table => {
			table.increments( 'id' ).primary();
			table.enum( 'type', [ 'info', 'warning', 'error' ] ).notNullable().defaultTo( 'info' );
			table.string( 'message' ).notNullable();
            table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} )

    ] );

};

exports.down = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.dropTable( 'logging' )

    ] );

};
