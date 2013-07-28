/*global module, test, expect, raises, ok, equal, deepEqual */
/*global lightstore */
/*jshint node:true */
(function () {
    'use strict';

    var fs = require('fs'),
        path = require('path');

    module("Rjson");

    test("Instantiation", function () {
        var rjson;

        rjson = lightstore.Rjson.create('test.foo');
        equal(rjson.fileName, 'test.foo', "File name initialized");
    });

    test("General reading", function () {
        var rjson = lightstore.Rjson.create('test.foo');

        expect(2);

        raises(function () {
            rjson.read();
        }, "Calling read without a handler specified");

        fs.addMocks({
            readFile: function (fileName) {
                equal(fileName, 'test.foo', "File name received");
            }
        });

        rjson.read(function () {});

        fs.removeMocks();
    });

    test("Reading RJSON", function () {
        expect(1);

        var rjson = lightstore.Rjson.create('test.ls');

        fs.addMocks({
            readFile: function (fileName, handler) {
                // returns RJSON contents
                handler(undefined, '{"hello":"world"');
            }
        });

        rjson.read(function (err, data) {
            deepEqual(data, {hello: "world"}, "Rjson contents");
        });

        fs.removeMocks();
    });

    test("Writing (appending)", function () {
        var rjson = lightstore.Rjson.create('test.foo');

        expect(3);

        raises(function () {
            rjson.write();
        }, "Calling write without data");

        raises(function () {
            rjson.write({foo: "bar"}, "non-function");
        }, "Calling write with invalid handler");

        fs.addMocks({
            appendFile: function (fileName) {
                equal(fileName, 'test.foo', "File name received");
            }
        });

        rjson.write({foo: "bar"});

        fs.removeMocks();
    });

    test("Compaction", function () {
        var rjson = lightstore.Rjson.create('test.foo');

        expect(2);

        lightstore.Rjson.addMocks({
            read: function (handler) {
                ok(typeof handler === 'function', "");
            }
        });

        raises(function () {
            rjson.compact("non-function");
        }, "Compact called without handler");

        rjson.compact();

        lightstore.Rjson.removeMocks();
    });
}());
