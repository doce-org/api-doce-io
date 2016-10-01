'use strict';

const hooks = require( 'feathers-hooks' );
const power = require( './hooks' );

exports.before = {
    all: [],
    find: [],
    get: [],
    create: [
        power.convertData()
    ],
    update: [],
    patch: [],
    remove: []
};

exports.after = {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
};
