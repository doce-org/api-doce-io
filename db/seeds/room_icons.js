'use strict';

exports.seed = function( knex, Promise ) {

    return knex( 'rooms_icons' ).delete()
        .then( () => {

            return Promise.all( [
                knex( 'rooms_icons' ).insert( { name: 'cuisine', image: '/static/img/rooms/kitchen-icon.png' } ),
                knex( 'rooms_icons' ).insert( { name: 'salle de bain', image: '/static/img/rooms/bathroom-icon.png' } ),
                knex( 'rooms_icons' ).insert( { name: 'salon', image: '/static/img/rooms/livingroom-icon.png' } )
            ] );

    } );

};
