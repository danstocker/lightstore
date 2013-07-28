/*global module, test, expect, raises, ok, equal, deepEqual */
/*global lightstore */
/*jshint node:true */
(function () {
    'use strict';

    var fs = require('fs');

    module("File");

    test("Instantiation", function () {
        var file;

        file = lightstore.Json.create('test.foo');
        equal(file.fileName, 'test.foo', "File name initialized");
    });
}());
