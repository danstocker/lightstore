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
        .prepareSurrogates(function (fileName) {
            return [path.extname(fileName)];
        })
        .addSurrogate(lightstore, 'Json', function (fileExt) {
            return fileExt === '.json';
        })
        .addSurrogate(lightstore, 'Rjson', function (fileExt) {
            return fileExt === '.rjson';
        })
        .addSurrogate(lightstore, 'KeyValueStore', function (fileExt) {
            return fileExt === '.ls';
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

            /**
             * Reads data from file.
             * @name lightstore.File#read
             * @function
             * @param {function} [handler]
             * @returns {lightstore.File}
             */

            /**
             * Writes data to file.
             * @name lightstore.File#write
             * @function
             * @param {*} data
             * @param {function} [handler]
             * @returns {lightstore.File}
             */
        });
});
