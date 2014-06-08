/*global module, test, expect, raises, ok, equal, strictEqual, deepEqual */
/*global lightstore */
/*jshint node:true */
(function () {
    'use strict';

    var fs = require('fs');

    module("Json");

    test("General reading", function () {
        var json = lightstore.Json.create('test.foo');

        expect(2);

        raises(function () {
            json.read();
        }, "Calling read without a handler specified");

        fs.addMocks({
            readFile: function (fileName) {
                equal(fileName, 'test.foo', "File name received");
            }
        });

        json.read(function () {});

        fs.removeMocks();
    });

    test("Reading plain JSON", function () {
        expect(1);

        var json = lightstore.Json.create('test.json');

        fs.addMocks({
            readFile: function (fileName, handler) {
                // returns JSON contents
                handler(undefined, '{"hello":"world"}');
            }
        });

        json.read(function (err, data) {
            deepEqual(data, {hello: "world"}, "Json contents");
        });

        fs.removeMocks();
    });

    test("Writing plain JSON", function () {
        expect(2);

        var json = lightstore.Json.create('test.json');

        fs.addMocks({
            writeFile: function (fileName, data, handler) {
                equal(data, JSON.stringify({hello: "world"}), "Json contents");
                handler(undefined);
            }
        });

        json.write({hello: "world"}, function () {
            ok(true, "handler called");
        });

        fs.removeMocks();
    });

    test("Clearing contents", function () {
        expect(6);

        var json = lightstore.Json.create('test.json');

        function onClear () {}

        raises(function () {
            json.clear('foo');
        }, "should raise exception on invalid handler");

        fs.addMocks({
            exists: function (fileName, handler) {
                equal(fileName, 'test.json', "should test if file exists");
                handler(true);
            },

            writeFile: function (fileName, content, handler) {
                equal(fileName, 'test.json', "should write file contents");
                equal(content, '{}', "should pass empty string as contents to write");
                strictEqual(handler, onClear, "should pass handler to write");
            }
        });

        strictEqual(json.clear(onClear), json, "should be chainable");

        fs.removeMocks();
    });
}());
