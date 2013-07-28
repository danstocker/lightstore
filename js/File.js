/*global dessert, troop, lightstore */
/*jshint node:true */
troop.postpone(lightstore, 'File', function () {
    'use strict';

    var path = require('path'),
        fs = require('fs');

    /**
     * @name lightstore.File.create
     * @function
     * @param {string} fileName Name of database file.
     * @returns {lightstore.File}
     */

    /**
     * @class
     * @extends troop.Base
     */
    lightstore.File = troop.Base.extend()
        .addSurrogate(lightstore, 'Json', function (fileName) {
            return path.extname(fileName) === '.json';
        })
        .addSurrogate(lightstore, 'Rjson', function (fileName) {
            return path.extname(fileName) === '.rjson';
        })
        .addSurrogate(lightstore, 'KeyValueStore', function (fileName) {
            return path.extname(fileName) === '.ls';
        })
        .addMethods(/** @lends lightstore.File# */{
            /**
             * Initializes JSON.
             * @param {string} fileName
             */
            init: function (fileName) {
                /**
                 * @constant
                 * @type {string}
                 */
                this.fileName = fileName;
            }
        });
});
