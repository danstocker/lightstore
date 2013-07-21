/*global module, test, expect, raises, ok, equal, deepEqual, strictEqual */
/*global radiant */
/*jshint node:true */
(function () {
    'use strict';

    module("KeyValueStore");

    test("Write", function () {
        expect(3);

        var store = radiant.KeyValueStore.create('foo.rjson'),
            result;

        function onSaved() {}

        radiant.Rjson.addMocks({
            write: function (buffer, handler) {
                deepEqual(
                    buffer,
                    {
                        "test>path": '{"foo":"bar"}'
                    },
                    "Buffer containing path/value pair"
                );

                strictEqual(handler, onSaved, "On-save handler");
            }
        });

        result = store.write(['test', 'path'].toPath(), {foo: "bar"}, onSaved);
        strictEqual(result, store, "Writing is chainable");

        radiant.Rjson.removeMocks();
    });
}());
