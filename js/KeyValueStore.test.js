/*global module, test, expect, raises, ok, equal, deepEqual, strictEqual */
/*global lightstore */
/*jshint node:true */
(function () {
    'use strict';

    module("KeyValueStore");

    test("Rjson buffer consolidation", function () {
        var rjsonFragmented = [
                {key: "root>test>path", value: "hello"},
                {key: "root>test>foo", value: 1},
                {key: "root>foo>bar>baz", value: {hello: "world"}},
                {key: "root>test>path>hello", value: "all"},
                {key: "root>foo>bar>baz>boo", value: 1234}
            ],
            rjsonConsolidated = {
                "root": {
                    test: {
                        foo : 1,
                        path: {
                            hello: "all"
                        }
                    },
                    foo : {
                        bar: {
                            baz: {
                                hello: "world",
                                boo  : 1234
                            }
                        }
                    }
                }
            };

        deepEqual(
            lightstore.KeyValueStore._consolidateTree(rjsonFragmented),
            rjsonConsolidated,
            "Fragmented RJSON consolidated"
        );

        deepEqual(
            lightstore.KeyValueStore._consolidateTree([
                {key: "root", value: rjsonConsolidated.root}
            ]),
            rjsonConsolidated,
            "Consolidated RJSON consolidated again"
        );
    });

    test("Read handler", function () {
        expect(2);

        var store = /** @type {lightstore.KeyValueStore} */
                lightstore.KeyValueStore.create('foo.rjson'),
            rawContents = [
                {key: "root", value: "foo"}
            ];

        store.addMocks({
            _consolidateTree: function (json) {
                strictEqual(json, rawContents, "Original data passed for consolidation");
                return {root: "foo"};
            }
        });

        function onRead(err, json) {
            equal(json, "foo", "Root node");
        }

        store._onRead(onRead, undefined, rawContents);
    });

    test("Read handler w/ empty file", function () {
        expect(1);

        var store = /** @type {lightstore.KeyValueStore} */
            lightstore.KeyValueStore.create('foo.rjson');

        function onRead(err, json) {
            deepEqual(json, {}, "Root node from empty file");
        }

        store._onRead(onRead, undefined);
    });

    test("Read", function () {
        expect(2);

        var store = lightstore.KeyValueStore.create('foo.rjson'),
            result;

        function onRead() {}

        lightstore.Rjson.addMocks({
            read: function () {
                ok(true, "Read called");
            }
        });

        result = store.read(onRead);
        strictEqual(result, store, "Reading is chainable");

        lightstore.Rjson.removeMocks();
    });

    test("Write", function () {
        expect(3);

        var store = lightstore.KeyValueStore.create('foo.rjson'),
            result;

        function onSaved() {}

        lightstore.Rjson.addMocks({
            write: function (buffer, handler) {
                deepEqual(
                    buffer,
                    [
                        {key: "root>test>path", value: {foo: "bar"}}
                    ],
                    "Buffer containing path/value pair"
                );

                strictEqual(handler, onSaved, "On-save handler");
            }
        });

        result = store.write(['test', 'path'].toPath(), {foo: "bar"}, onSaved);
        strictEqual(result, store, "Writing is chainable");

        lightstore.Rjson.removeMocks();
    });
}());
