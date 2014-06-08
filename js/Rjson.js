/*global dessert, troop, lightstore */
/*jshint node:true */
troop.postpone(lightstore, 'Rjson', function () {
    'use strict';

    var fs = require('fs'),
        base = lightstore.File,
        self = base.extend();

    /**
     * @name lightstore.Rjson.create
     * @function
     * @param {string} fileName Name of database file.
     * @returns {lightstore.Rjson}
     */

    /**
     * Redundant JSON I/O
     * May contain the same key several times over. Upon parsing,
     * the last value (which is also the latest) will be used.
     * @class
     * @extends lightstore.File
     */
    lightstore.Rjson = self
        .addPrivateMethods(/** @lends lightstore.Rjson# */{
            /**
             * Called when data is read from disk.
             * @param {function} handler
             * @param {object} err
             * @param {object} data
             * @private
             */
            _onRead: function (handler, err, data) {
                var serialized,
                    parsed;

                if (!err) {
                    serialized = data.toString();
                    this.isArray = serialized[0] === '[';
                    try {
                        parsed = JSON.parse(serialized + (this.isArray ? ']' : '}'));
                    } catch (e) {
                        dessert.assert(false, "Invalid RJSON");
                    }
                }

                handler(err, parsed);
            },

            /**
             * Called when data is loaded and is ready to be compacted.
             * Saves data back to disk immediately on success,
             * calls handler (if any) immediately on error.
             * @param {function} handler
             * @param {Error} err
             * @param {object} data
             * @private
             */
            _onCompact: function (handler, err, data) {
                if (!err) {
                    fs.writeFile(
                        this.fileName,
                        JSON.stringify(data).slice(0, -1),
                        handler
                    );
                } else if (handler) {
                    handler(err, data);
                }
            }
        })
        .addMethods(/** @lends lightstore.Rjson# */{
            /** @ignore */
            init: function (fileName) {
                base.init.call(this, fileName);

                /**
                 * Signifies data buffer type.
                 * Important because of record/change order.
                 * @type {boolean}
                 */
                this.isArray = undefined;
            },

            /**
             * Reads the whole RJSON database file.
             * @param {function} handler Callback
             * @returns {lightstore.Rjson}
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
             * Compacts database files.
             * @param {function} [handler] Callback
             * @returns {lightstore.Rjson}
             */
            compact: function (handler) {
                dessert.isFunctionOptional(handler, "Invalid compaction handler");

                this.read(self._onCompact.bind(this, handler));

                return this;
            },

            /**
             * Writes object to database.
             * @param {object} data
             * @param {function} [handler] Callback
             * @returns {lightstore.Rjson}
             */
            write: function (data, handler) {
                dessert
                    .isObject(data, "Invalid write data buffer")
                    .isFunctionOptional(handler, "Invalid write handler");

                var that = this,
                    fileName = this.fileName;

                fs.exists(fileName, function (exists) {
                    var serialized;

                    if (exists) {
                        // checking input against buffer type
                        if (data instanceof Array !== that.isArray) {
                            if (handler) {
                                handler(new Error("Buffer type mismatch"));
                            }
                            return;
                        }

                        // file exists, making diff
                        serialized = ',' + JSON.stringify(data).slice(1, -1);
                    } else {
                        // file is new, establishing buffer type
                        that.isArray = data instanceof Array;

                        // leaving opening brace
                        serialized = JSON.stringify(data).slice(0, -1);
                    }

                    fs.appendFile(
                        fileName,
                        serialized,
                        handler
                    );
                });

                return this;
            },

            /**
             * Clears RJSON database.
             * @param {function} [handler] Callback
             * @returns {lightstore.Rjson}
             */
            clear: function (handler) {
                dessert.isFunctionOptional(handler, "Invalid write handler");

                var fileName = this.fileName;

                fs.exists(fileName, function (exists) {
                    if (exists) {
                        fs.writeFile(fileName, '', handler);
                    }
                });

                return this;
            }
        });
});
