/*global module, test, expect, raises, ok, equal, deepEqual, strictEqual */
/*global sntls, lightstore */
/*jshint node:true */
(function () {
    'use strict';

    module("PersistedTree");

    test("Instantiation", function () {
        var treeStore = /** @type {lightstore.PersistedTree} */
            lightstore.PersistedTree.create('test.ls');

        ok(treeStore._store.isA(lightstore.KeyValueStore), "Store member assigned");
    });

    test("Reading", function () {
        expect(2);

        var fs = require('fs'),
            treeStore = /** @type {lightstore.PersistedTree} */
                lightstore.PersistedTree.create('test.ls');

        fs.addMocks({
            readFile: function (fileName, handler) {
                handler(undefined, '"root":{"hello":"world"},');
            }
        });

        treeStore.read(function (json) {
            deepEqual(json, {hello: "world"}, "File contents read");
        });

        fs.removeMocks();

        deepEqual(treeStore.items, {hello: "world"}, "File contents read");
    });

    test("Saving to new file", function () {
        expect(5);

        function onSaved() {}

        lightstore.KeyValueStore.addMocks({
            write: function (path, value, handler) {
                equal(this.fileName, 'test.ls', "File name");
                deepEqual(path.asArray, [], "Empty path");
                deepEqual(value, {}, "Contents");
                strictEqual(handler, onSaved, "Success handler");
            }
        });

        var treeStore = lightstore.PersistedTree.create('test.json'),
            result;

        result = treeStore.saveAs('test.ls', onSaved);

        strictEqual(result, treeStore, "Saving is chainable");

        lightstore.KeyValueStore.removeMocks();
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
                lightstore.PersistedTree.create('test.ls')
                    .read(),
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
