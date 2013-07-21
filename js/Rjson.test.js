/*global module, test, expect, raises, ok, equal */
/*global radiant */
/*jshint node:true */
(function (fs) {
    'use strict';

    module("Rjson");

    test("Creation", function () {
        var rjson = radiant.Rjson.create('test.foo');
        equal(rjson.fileName, 'test.foo', "File name initialized");
    });

    test("Reading", function () {
        var rjson = radiant.Rjson.create('test.foo');

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

    test("Writing (appending)", function () {
        var rjson = radiant.Rjson.create('test.foo');

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
        var rjson = radiant.Rjson.create('test.foo');

        expect(2);

        radiant.Rjson.addMocks({
            read: function (handler) {
                ok(typeof handler === 'function', "");
            }
        });

        raises(function () {
            rjson.compact("non-function");
        }, "Compact called without handler");

        rjson.compact();

        radiant.Rjson.removeMocks();
    });
}(require('fs')));
