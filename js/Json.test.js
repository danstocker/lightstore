/*global module, test, expect, raises, ok, equal, deepEqual */
/*global lightstore */
/*jshint node:true */
(function () {
    'use strict';

    var fs = require('fs'),
        path = require('path');

    module("Json");

    test("Instantiation", function () {
        var rjson;

        rjson = lightstore.Json.create('test.foo');
        equal(rjson.fileName, 'test.foo', "File name initialized");
    });

    test("General reading", function () {
        var rjson = lightstore.Json.create('test.foo');

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

    test("Reading plain JSON", function () {
        expect(1);

        var rjson = lightstore.Json.create('test.json');

        fs.addMocks({
            readFile: function (fileName, handler) {
                // returns RJSON contents
                handler(undefined, '{"hello":"world"}');
            }
        });

        rjson.read(function (data) {
            deepEqual(data, {hello: "world"}, "Json contents");
        });

        fs.removeMocks();
    });
}());
