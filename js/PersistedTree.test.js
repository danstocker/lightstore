/*global module, test, expect, raises, ok, equal, deepEqual, strictEqual */
/*global sntls, lightstore */
/*jshint node:true */
(function () {
    'use strict';

    module("PersistedTree");

    test("Instantiation", function () {
        var fs = require('fs');

        fs.addMocks({
            readFile: function (fileName, handler) {
                handler(undefined, '"root":{"hello":"world"},');
            }
        });

        var treeStore = /** @type {lightstore.PersistedTree} */
            lightstore.PersistedTree.create('fileName');

        fs.removeMocks();

        deepEqual(treeStore.items, {hello: "world"}, "File contents read");
    });

    test("Writing", function () {
        expect(4);

        lightstore.KeyValueStore.addMocks({
            read: function () {
                ok(true, "Data read");
                return this;
            }
        });

        var treeStore = /** @type {lightstore.PersistedTree} */
                lightstore.PersistedTree.create('fileName'),
            destinationPath = 'foo>bar'.toPath();

        lightstore.KeyValueStore.removeMocks();

        treeStore._store.addMocks({
            write: function (path, value) {
                strictEqual(path, destinationPath, "Destination path");
                equal(value, 'hello', "Node value");
            }
        });

        sntls.Tree.addMocks({
            setNode: function () {
                ok(true, "Node set in memory");
            }
        });

        treeStore.setNode(destinationPath, 'hello');

        treeStore._store.removeMocks();

        sntls.Tree.removeMocks();
    });
}());
