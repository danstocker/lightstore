/*global module, test, expect, raises, ok, equal, deepEqual, strictEqual */
/*global radiant */
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
            radiant.KeyValueStore._compactBuffer(rjsonFragmented),
            rjsonCompacted,
            "Fragmented RJSON compacted"
        );

        deepEqual(
            radiant.KeyValueStore._compactBuffer(rjsonCompacted),
            rjsonCompacted,
            "Compacted RJSON compacted again"
        );
    });

    test("Read", function () {
        expect(2);

        var store = radiant.KeyValueStore.create('foo.rjson'),
            result;

        function onRead() {}

        radiant.Rjson.addMocks({
            read: function () {
                ok(true, "Read called");
            }
        });

        result = store.read(onRead);
        strictEqual(result, store, "Reading is chainable");

        radiant.Rjson.removeMocks();
    });

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
                        "root>test>path": {foo: "bar"}
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
