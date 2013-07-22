/*global module, test, expect, raises, ok, equal, deepEqual, strictEqual */
/*global lightstore */
/*jshint node:true */
(function () {
    'use strict';

    module("KeyValueStore");

    test("Rjson buffer consolidation", function () {
        var rjsonFragmented = {
                "root>test>path"      : "hello",
                "root>test>foo"       : 1,
                "root>foo>bar>baz"    : {hello: "world"},
                "root>test>path>hello": "all",
                "root>foo>bar>baz>boo": 1234
            },
            rjsonCompacted = {
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
            lightstore.KeyValueStore._compactBuffer(rjsonFragmented),
            rjsonCompacted,
            "Fragmented RJSON compacted"
        );

        deepEqual(
            lightstore.KeyValueStore._compactBuffer(rjsonCompacted),
            rjsonCompacted,
            "Compacted RJSON compacted again"
        );
    });

    test("Read handler", function () {
        expect(2);

        var store = /** @type {lightstore.KeyValueStore} */
                lightstore.KeyValueStore.create('foo.rjson'),
            rawContents = {root: "foo"};

        store.addMocks({
            _compactBuffer: function (json) {
                strictEqual(json, rawContents, "Original data passed for compaction");
                return json;
            }
        });

        function onRead(err, json) {
            equal(json, "foo", "Root node");
        }

        store._onRead(onRead, {}, rawContents);
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
                    {
                        "root>test>path": {foo: "bar"}
                    },
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
