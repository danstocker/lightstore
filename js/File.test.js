/*global module, test, expect, raises, ok, equal, deepEqual */
/*global lightstore */
/*jshint node:true */
(function () {
    'use strict';

    var fs = require('fs');

    module("File");

    test("Instantiation", function () {
        var file = lightstore.File.create('test.foo');
        ok(file.instanceOf(lightstore.File), "File instance");
        equal(file.fileName, 'test.foo', "File name initialized");
    });

    test("Surrogates", function () {
        var file;

        file = lightstore.File.create('foo.json');
        ok(file.instanceOf(lightstore.Json), "Json instance");

        file = lightstore.File.create('foo.rjson');
        ok(file.instanceOf(lightstore.Rjson), "Rjson instance");

        file = lightstore.File.create('foo.ls');
        ok(file.instanceOf(lightstore.KeyValueStore), "Key-value store instance");
    });
}());
