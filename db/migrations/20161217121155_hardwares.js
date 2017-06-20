'use strict';

exports.up = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.createTable( 'hardwares', table => {
			table.increments( 'id' ).primary();
            table.string( 'identifier' ).notNullable();
			table.string( 'type' ).notNullable();
            table.string( 'name' );
			table.timestamp( 'created_at' ).notNullable().defaultTo( knex.raw( 'now()' ) );
		} )

    ] );

};

exports.down = function( knex, Promise ) {

    return Promise.all( [

        knex.schema.dropTable( 'hardwares' ),
        knex.schema.dropTable( 'connections' ),
		knex.schema.dropTable( 'ports' )

    ] );

};
