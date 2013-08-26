/*global module, test, expect, raises, ok, equal, deepEqual, strictEqual */
/*global sntls, lightstore */
/*jshint node:true */
(function () {
    'use strict';

    module("PersistedTree");

    test("Instantiation", function () {
        var treeStore = /** @type {lightstore.PersistedTree} */
            lightstore.PersistedTree.create('test.ls');

        ok(treeStore.file.isA(lightstore.KeyValueStore), "Store member assigned");
    });

    test("Type conversion", function () {
        var treeStore = sntls.Hash.create({foo: "bar"})
            .toPersistedTree('fool.ls');

        ok(treeStore.isA(lightstore.PersistedTree), "Hash converted to persisted tree");
    });

    test("Reading", function () {
        expect(2);

        var fs = require('fs'),
            treeStore = /** @type {lightstore.PersistedTree} */
                lightstore.PersistedTree.create('test.ls');

        fs.addMocks({
            readFile: function (fileName, handler) {
                handler(undefined, '[{"k":"root","v":{"hello":"world"}}');
            }
        });

        treeStore.load(function (err, json) {
            deepEqual(json, {hello: "world"}, "File contents read");
        });

        fs.removeMocks();

        deepEqual(treeStore.items, {hello: "world"}, "File contents read");
    });

    test("Saving to new file", function () {
        expect(5);

        function onSaved() {}

        lightstore.KeyValueStore.addMocks({
            write: function (value, handler, path) {
                equal(this.fileName, 'test.ls', "File name");
                equal(typeof path, 'undefined', "Empty path");
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

    test("Saving", function () {
        expect(5);

        function onSave() {}

        var treeStore = lightstore.PersistedTree.create('foo.ls'),
            result;

        lightstore.KeyValueStore.addMocks({
            write: function (value, handler, path) {
                equal(this.fileName, 'foo.ls', "File name");
                equal(typeof path, 'undefined', "Empty path");
                strictEqual(value, treeStore.items, "Contents");
                strictEqual(handler, onSave, "Success handler");
            }
        });

        result = treeStore.save(onSave);

        strictEqual(result, treeStore, "Saving is chainable");

        lightstore.PersistedTree.removeMocks();
    });

    test("Writing (internal)", function () {
        expect(3);

        var treeStore = /** @type {lightstore.PersistedTree} */
                lightstore.PersistedTree.create('test.ls'),
            destinationPath = 'foo>bar'.toPath();

        function onWrite() {}

        treeStore.file.addMocks({
            write: function (value, handler, path) {
                strictEqual(path, destinationPath, "Destination path");
                equal(value, 'hello', "Node value");
                strictEqual(handler, onWrite, "Write handler");
            }
        });

        sntls.Tree.addMocks({
            setNode: function () {
                ok(true, "Node set in memory");
            }
        });

        treeStore._write(destinationPath, 'hello', onWrite);

        treeStore.file.removeMocks();

        sntls.Tree.removeMocks();
    });

    test("Safe node retrieval", function () {
        expect(5);

        var treeStore = /** @type {lightstore.PersistedTree} */
                lightstore.PersistedTree.create('test.ls'),
            destinationPath = 'foo>bar'.toPath();

        function onWrite() {}

        // node exists

        treeStore.addMocks({
            _write: function () {
                // should not be called
                ok(true, "Storage write called");
            }
        });
        sntls.Tree.addMocks({
            getSafeNode: function () {
                // no change, handler is not called
                return 'hello';
            }
        });

        equal(treeStore.getSafeNode(destinationPath), 'hello', "Node retrieved");

        treeStore.removeMocks();
        sntls.Tree.removeMocks();

        // node does not exist

        treeStore.addMocks({
            _write: function (path, value, handler) {
                strictEqual(path, destinationPath, "Safe destination path");
                deepEqual(value, {}, "Safe node value");
                strictEqual(handler, onWrite, "Write event handler");
            }
        });
        sntls.Tree.addMocks({
            getSafeNode: function (path, handler) {
                handler(path, {});
                return {};
            }
        });

        deepEqual(treeStore.getSafeNode(destinationPath, onWrite), {}, "Safe node retrieved");

        treeStore.removeMocks();
        sntls.Tree.removeMocks();
    });

    test("Get or set node", function () {
        expect(5);

        var treeStore = /** @type {lightstore.PersistedTree} */
                lightstore.PersistedTree.create('test.ls'),
            destinationPath = 'foo>bar'.toPath();

        function onWrite() {}

        function nodeGenerator() {return {};}

        // node exists

        treeStore.addMocks({
            _write: function () {
                // should not be called
                ok(true, "Storage write called");
            }
        });
        sntls.Tree.addMocks({
            getOrSetNode: function () {
                // no change, handler is not called
                return 'hello';
            }
        });

        equal(treeStore.getOrSetNode(destinationPath), 'hello', "Node retrieved");

        treeStore.removeMocks();
        sntls.Tree.removeMocks();

        // node does not exist

        treeStore.addMocks({
            _write: function (path, value, handler) {
                strictEqual(path, destinationPath, "Safe destination path");
                deepEqual(value, {}, "Safe node value");
                strictEqual(handler, onWrite, "Write event handler");
            }
        });
        sntls.Tree.addMocks({
            getOrSetNode: function (path, generator, handler) {
                var result = generator();
                handler(path, result);
                return result;
            }
        });

        deepEqual(treeStore.getOrSetNode(destinationPath, nodeGenerator, onWrite), {}, "Safe node retrieved");

        treeStore.removeMocks();
        sntls.Tree.removeMocks();
    });

    test("Writing", function () {
        expect(4);

        var treeStore = /** @type {lightstore.PersistedTree} */
                lightstore.PersistedTree.create('test.ls'),
            destinationPath = 'foo>bar'.toPath(),
            result;

        treeStore.addMocks({
            _write: function (path, value) {
                strictEqual(path, destinationPath, "Destination path");
                equal(value, 'hello', "Node value");
            }
        });
        sntls.Tree.addMocks({
            setNode: function () {
                ok(true, "Node set in memory");
            }
        });

        result = treeStore.setNode(destinationPath, 'hello');

        strictEqual(result, treeStore, "Node set is chainable");

        treeStore.removeMocks();
        sntls.Tree.removeMocks();
    });

    test("Unsetting value", function () {
        expect(5);

        var treeStore = /** @type {lightstore.PersistedTree} */
                lightstore.PersistedTree.create('test.ls'),
            destinationPath = 'foo>bar'.toPath(),
            result;

        function onUnset() {}

        treeStore.addMocks({
            _write: function (path, value, handler) {
                strictEqual(path, destinationPath, "Destination path");
                equal(typeof value, 'undefined', "Undefined node value");
                strictEqual(handler, onUnset, "Unset handler");
            }
        });
        sntls.Tree.addMocks({
            unsetNode: function (path) {
                strictEqual(path, destinationPath, "Unset path");
            }
        });

        result = treeStore.unsetNode(destinationPath, onUnset);

        strictEqual(result, treeStore, "Node unset is chainable");

        treeStore.removeMocks();
        sntls.Tree.removeMocks();
    });

    test("Unsetting key", function () {
        expect(9);

        var treeStore = /** @type {lightstore.PersistedTree} */
                lightstore.PersistedTree.create('test.ls'),
            destinationPath = 'foo>bar'.toPath(),
            useSplice, // whether to use splice in unsetKey
            result;

        function onUnset() {}

        treeStore.addMocks({
            _write: function (path, value, handler) {
                if (useSplice) {
                    deepEqual(path, destinationPath.clone().trimRight(), "Destination path");
                } else {
                    strictEqual(path, destinationPath, "Destination path");
                }
                equal(typeof value, 'undefined', "Undefined node value");
                strictEqual(handler, onUnset, "Unset handler");
            }
        });
        sntls.Tree.addMocks({
            unsetKey: function (path, splice, handler) {
                strictEqual(path, destinationPath, "Destination path");
                if (useSplice) {
                    handler(path.clone().trimRight());
                } else {
                    handler(path);
                }
            }
        });

        useSplice = false;
        result = treeStore.unsetKey(destinationPath, useSplice, onUnset);

        strictEqual(result, treeStore, "Node unset is chainable");

        useSplice = true;
        treeStore.unsetKey(destinationPath, useSplice, onUnset);

        treeStore.removeMocks();
        sntls.Tree.removeMocks();
    });

    test("Unsetting path", function () {
        expect(5);

        var treeStore = /** @type {lightstore.PersistedTree} */
                lightstore.PersistedTree.create('test.ls'),
            destinationPath = 'foo>bar'.toPath(),
            result;

        function onUnset() {}

        treeStore.addMocks({
            _write: function (path, value, handler) {
                deepEqual(path, destinationPath.clone().trimRight(), "Destination path");
                equal(typeof value, 'undefined', "Undefined node value");
                strictEqual(handler, onUnset, "Unset handler");
            }
        });
        sntls.Tree.addMocks({
            unsetPath: function (path, splice, handler) {
                strictEqual(path, destinationPath, "Destination path");
                handler(path.clone().trimRight());
            }
        });

        result = treeStore.unsetPath(destinationPath, false, onUnset);

        strictEqual(result, treeStore, "Node unset is chainable");

        treeStore.removeMocks();
        sntls.Tree.removeMocks();
    });
}());
