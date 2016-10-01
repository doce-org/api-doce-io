'use strict';

const assert = require('assert');
const populateSensors = require('../../../../src/services/rooms/hooks/populateSensors.js');

describe('rooms populateSensors hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    populateSensors()(mockHook);

    assert.ok(mockHook.populateSensors);
  });
});
