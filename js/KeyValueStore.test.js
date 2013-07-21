/*global module, test, expect, raises, ok, equal, deepEqual, strictEqual */
/*global radiant */
/*jshint node:true */
(function () {
    'use strict';

    module("KeyValueStore");

    test("Rjson to tree conversion", function () {
        var rjson = {
            "test>path"      : "hello",
            "test>foo"       : 1,
            "foo>bar>baz"    : {hello: "world"},
            "test>path>hello": "all",
            "foo>bar>baz>boo": 1234
        };

        deepEqual(
            radiant.KeyValueStore._convertToTree(rjson),
            {
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
            },
            "Rjson converted to tree"
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
