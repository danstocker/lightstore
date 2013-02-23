/*global module, test, expect, raises, ok, equal */
/*global troop */
(function (fs, Rjson) {
    'use strict';

    module("Rjson");

    test("Creation", function () {
        var rjson = Rjson.create('test.foo');
        equal(rjson.fileName, 'test.foo', "File name initialized");
    });

    test("Reading", function () {
        var rjson = Rjson.create('test.foo');

        expect(2);

        raises(function () {
            rjson.read();
        }, "Calling read without a handler specified");

        fs.addMock({
            readFile: function (fileName) {
                equal(fileName, 'test.foo', "File name received");
            }
        });

        rjson.read(function () {});

        fs.removeMocks();
    });

    test("Writing (appending)", function () {
        var rjson = Rjson.create('test.foo');

        expect(3);

        raises(function () {
            rjson.write();
        }, "Calling write without data");

        raises(function () {
            rjson.write({foo: "bar"}, "non-function");
        }, "Calling write with invalid handler");

        fs.addMock({
            appendFile: function (fileName) {
                equal(fileName, 'test.foo', "File name received");
            }
        });

        rjson.write({foo: "bar"});

        fs.removeMocks();
    });

    test("Compaction", function () {
        var rjson = Rjson.create('test.foo');

        expect(2);

        Rjson.addMock({
            read: function (handler) {
                ok(typeof handler === 'function', "");
            }
        });

        raises(function () {
            rjson.compact("non-function");
        }, "Compact called without handler");

        rjson.compact();

        Rjson.removeMocks();
    });
}(require('fs'), require('Rjson').Rjson));
