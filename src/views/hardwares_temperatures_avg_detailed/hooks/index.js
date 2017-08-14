'use strict';

const hooks = require( 'feathers-hooks' );

exports.before = {
    all: [],
    find: [],
    get: [],
    create: [
        hooks.disable()
    ],
    update: [
        hooks.disable()
    ],
    patch: [
        hooks.disable()
    ],
    remove: [
        hooks.disable()
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
