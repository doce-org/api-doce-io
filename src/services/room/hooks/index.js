'use strict';

const hooks = require( 'feathers-hooks' );

exports.before = {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
};

exports.after = {
    all: [],
    find: [
        hooks.populate( 'room_icon', { service: '/rooms/icons', field: 'room_icon_id' } )
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
};
