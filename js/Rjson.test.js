/*global module, test, expect, raises, equal */
(function (radiant, troop, fs) {
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

        fs.addMock({
            readFile: function (fileName, handler) {
                equal(fileName, 'test.foo', "File name received");
            }
        });

        rjson.read(function () {});

        fs.removeMocks();
    });
}(this.radiant, this.troop, require('fs')));
