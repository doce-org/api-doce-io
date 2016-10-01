'use strict';

const hooks = require( 'feathers-hooks' );

exports.before = {
    all: [],
    find: [],
    get: [],
    create: [
        hooks.disable( 'external' )
    ],
    update: [
        hooks.disable()
    ],
    patch: [
        hooks.disable()
    ],
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
