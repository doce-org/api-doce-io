'use strict';

/**
 * defaults options
 * @type {Object}
 * @author shad
 */
const defaults = {
	params: []
};

/**
 * prepare special parameters provided by the user for special actions or query
 * @example '{withUser: true}' => would return the data with the user included
 * @throws {BadRequest} if wasn't used on a 'before' hook
 * @param {Object} options
 * @author shad
 */
exports.prepareSpecialParams = function( options ) {

	return function( hook ) {

		if ( hook.type !== 'before' ) {
			throw new errors.BadRequest( `The 'prepareSpecialParams' hook should only be used as a 'before' hook.` );
		}

		options = Object.assign( {}, defaults, options );

		options.params.forEach( param => {
			if( hook.params.query.hasOwnProperty( param ) ) {
				hook.params[ param ] = hook.params.query[ param ];
				delete hook.params.query[ param ];
			}
		} );

	};

};