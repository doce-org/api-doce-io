'use strict';

const hooks = require( 'feathers-hooks' );
const hardware = require( './hooks' );

exports.before = {
    all: [],
    find: [],
    get: [],
    create: [
        hardware.isNewhardware()
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
