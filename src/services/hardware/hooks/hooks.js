'use strict';

const utils = require( 'feathers-hooks-common/lib/utils' );
const errors = require( 'feathers-errors' );
const shortID = require( 'shortid' );

/**
 * generate a random short ID from the new hardware
 *
 * @return {Object}
 *
 * @author shad
 */
exports.generateID = function () {

	return function ( hook ) {

		utils.checkContext( hook, 'before', [ 'create' ], 'generateID' );

		// generate a short id
		hook.data.identifier = shortID.generate();

		return hook;

	}

}
