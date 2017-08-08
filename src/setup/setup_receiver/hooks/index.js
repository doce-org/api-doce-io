'use strict';

const hooks = require( 'feathers-hooks' );

exports.before = {
    all: [],
    find: [],
    get: [
        hooks.disable()
    ],
    create: [
        hooks.disable( 'external' )
    ],
    update: [
        hooks.disable()
    ],
    patch: [
        hooks.disable()
    ],
    remove: [
        hooks.disable( 'external' )
    ]
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
