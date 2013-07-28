/*global module, test, expect, raises, ok, equal, deepEqual, strictEqual */
/*global lightstore */
/*jshint node:true */
(function () {
    'use strict';

    module("KeyValueStore");

    test("Rjson buffer consolidation", function () {
        var rjsonFragmented = [
                {k: "root>test>path", v: "hello"},
                {k: "root>test>foo", v: 1},
                {k: "root>foo>bar>baz", v: {hello: "world"}},
                {k: "root>test>path>hello", v: "all"},
                {k: "root>foo>bar>baz>boo", v: 1234}
            ],
            rjsonConsolidated = [
                {
                    k: "root",

                    v: {
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
                }
            ];

        deepEqual(
            lightstore.KeyValueStore._consolidateTree(rjsonFragmented),
            rjsonConsolidated,
            "Fragmented RJSON consolidated"
        );

        deepEqual(
            lightstore.KeyValueStore._consolidateTree(rjsonConsolidated),
            rjsonConsolidated,
            "Consolidated RJSON consolidated again"
        );
    });

    test("Read handler", function () {
        expect(2);

        var store = /** @type {lightstore.KeyValueStore} */
                lightstore.KeyValueStore.create('foo.rjson'),
            rawContents = [
                {k: "root", v: "foo"}
            ];

        lightstore.KeyValueStore.addMocks({
            _consolidateTree: function (json) {
                strictEqual(json, rawContents, "Original data passed for consolidation");
                return [
                    {k: "root", v: "foo"}
                ];
            }
        });

        function onRead(err, json) {
            deepEqual(json, [
                {k: "root", v: "foo"}
            ], "Root node");
        }

        store._onRead(onRead, undefined, rawContents);

        lightstore.KeyValueStore.removeMocks();
    });

    test("Read handler w/ empty file", function () {
        expect(1);

        var store = /** @type {lightstore.KeyValueStore} */
            lightstore.KeyValueStore.create('foo.rjson');

        function onRead(err, json) {
            deepEqual(json, [
                {k: 'root', v: {}}
            ], "Root node from empty file");
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
                        {k: "root>test>path", v: {foo: "bar"}}
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
