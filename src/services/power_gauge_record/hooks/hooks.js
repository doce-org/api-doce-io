'use strict';

const moment = require( 'moment' );

exports.convertData = function() {

	return function( hook ) {

		if ( hook.type !== 'before' ) {
		    throw new errors.BadRequest( `The 'convertData' hook should only be used as a 'before' hook.` );
		}

		if ( [ 'create' ].indexOf( hook.method ) === -1 ) {
            throw new errors.BadRequest( `The 'convertData' hook should only be used with the create method.` );
        }

        return new Promise( ( resolve, reject ) => {

        	const now = moment();

        	hook.app.service( '/powers/gauges/records' ).find( { 
        			query: { $limit: 1, $sort: { created_at: -1 } } }
        		)
        		.then( records => {

        			if( records.length === 1 ) {
        				const record = records[ 0 ];
        				const diff = now.diff( record.created_at, 'minutes' );

        				if( diff < 20 ) {
        					hook.data.power = +hook.data.energy / ( diff / 60 );
        				}

        			}

        			resolve( hook );

        		} )
        		.catch( reject );

        } );

	}

}
