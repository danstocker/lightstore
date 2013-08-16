/*global dessert, troop, lightstore */
/*jshint node:true */
troop.postpone(lightstore, 'Json', function () {
    'use strict';

    var fs = require('fs'),
        self = lightstore.File.extend();

    /**
     * @name lightstore.Json.create
     * @function
     * @param {string} fileName Name of database file.
     * @returns {lightstore.Json}
     */

    /**
     * Read-only JSON class.
     * @class
     * @extends lightstore.File
     */
    lightstore.Json = self
        .addPrivateMethods(/** @lends lightstore.Json# */{
            /**
             * Called when plain JSON data is read from disk.
             * @param {function} handler
             * @param {Error} err
             * @param {object} data
             * @private
             */
            _onRead: function (handler, err, data) {
                var parsed;

                if (!err) {
                    try {
                        parsed = JSON.parse(data.toString());
                    } catch (e) {
                        dessert.assert(false, "Invalid JSON");
                    }
                }

                handler(err, parsed);
            }
        })
        .addMethods(/** @lends lightstore.Json# */{
            /**
             * Reads JSON file.
             * @param {function} handler Callback
             * @returns {lightstore.Json}
             */
            read: function (handler) {
                dessert.isFunction(handler, "Invalid read handler");

                fs.readFile(
                    this.fileName,
                    self._onRead.bind(this, handler)
                );

                return this;
            },

            /**
             * Writes JSON file. Overwrites existing contents.
             * @param data
             * @param handler
             * @returns {*}
             */
            write: function (data, handler) {
                dessert.isFunctionOptional(handler, "Invalid read handler");

                fs.writeFile(
                    this.fileName,
                    JSON.stringify(data),
                    handler
                );

                return this;
            }
        });
});
