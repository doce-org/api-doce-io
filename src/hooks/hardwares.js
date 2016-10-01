'use strict';

/**
 * remove paired hardware after using it when
 * creating a new temperature / humidity sensor
 * or a new power / water gauge
 * @throws {BadRequest} if wasn't used on 'before' hook
 * @throws {BadRequest} if wasn't used on proper service methods
 * @return {Object}
 * @author shad
 */
exports.removePairedHardware = function() {

	return function( hook ) {

		if ( hook.type !== 'after' ) {
		    throw new errors.BadRequest( `The 'removePairedHardware' hook should only be used as a 'after' hook.` );
		}

		if ( [ 'create' ].indexOf( hook.method ) === -1 ) {
            throw new errors.BadRequest( `The 'removePairedHardware' hook should only be used with the create method.` );
        }

        if( !hook.result.hardware_id ) {
        	return hook;
        }

        return new Promise( ( resolve, reject ) => {

            console.log( hook.result );

        	hook.app.service( '/hardwares/new' ).remove( null, { query: { hardware_id: hook.result.hardware_id } } )
        		.then( () => resolve( hook ) )
        		.catch( reject );

        } );

	}

}