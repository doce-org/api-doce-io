'use strict';

/**
 * make sure the new hardware is actually new
 * @throws {BadRequest} if wasn't used on 'before' hook
 * @throws {BadRequest} if wasn't used on proper service methods
 * @throws {BadRequest} if all required data wasn't given
 * @return Promise
 * @author shad
 */
exports.isNewhardware = function() {

	return function( hook ) {

		if ( hook.type !== 'before' ) {
		    throw new errors.BadRequest( `The 'isNewhardware' hook should only be used as a 'before' hook.` );
		}

		if ( [ 'create' ].indexOf( hook.method ) === -1 ) {
            throw new errors.BadRequest( `The 'isNewhardware' hook should only be used with the create method.` );
        }

        if( !hook.data.hardware_id ) {
        	throw new errors.BadRequest( `You have to provide an hardware id.` );
        }

        return new Promise( ( resolve, reject ) => {

        	hook.app.service( '/hardwares/new' ).find( { query: { hardware_id: hook.data.hardware_id } } )
        		.then( res => {
        			if( res.length > 0 ) {
        				hook.result = true;
        			}
                    resolve( hook );
        		})
        		.catch( reject );

        } );

	}

}