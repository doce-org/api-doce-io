'use strict';

const hooks = require( 'feathers-hooks' );
const params = require( '../../../hooks/params' );
const record = require( './hooks' );

exports.before = {
    all: [],
    find: [
    	params.prepareSpecialParams( { params: [ 'withSensor' ] } )
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
};

exports.after = {
    all: [],
    find: [
    	record.getSensorIfNeeded()
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
};
