/*global dessert, troop, lightstore */
/*jshint node:true */
troop.postpone(lightstore, 'Rjson', function () {
    'use strict';

    var path = require('path'),
        fs = require('fs');

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
     * @extends troop.Base
     */
    lightstore.Rjson = troop.Base.extend()
        .addConstants(/** @lends lightstore.Rjson */{
            TYPE_JSON : 'JSON', // indicates plain JSON
            TYPE_RJSON: 'RJSON' // indicates redundant JSON (RJSON)
        })
        .addPrivateMethods(/** @lends lightstore.Rjson# */{
            /**
             * Called when plain JSON data is read from disk.
             * @param {function} handler
             * @param {object} err
             * @param {object} data
             * @private
             */
            _onJsonRead: function (handler, err, data) {
                dessert.assert(!err, "Error reading file", err);

                var parsed;

                try {
                    parsed = JSON.parse(data.toString());
                } catch (e) {
                    dessert.assert(false, "Invalid JSON");
                }

                handler.call(this, parsed);
            },

            /**
             * Called when data is read from disk.
             * @param {function} handler
             * @param {object} err
             * @param {object} data
             * @private
             */
            _onRjsonRead: function (handler, err, data) {
                dessert.assert(!err, "Error reading file", err);

                var parsed;

                try {
                    parsed = JSON.parse('{' + data.toString().slice(0, -1) + '}');
                } catch (e) {
                    dessert.assert(false, "Invalid RJSON");
                }

                handler.call(this, parsed);
            },

            /**
             * Called when data is loaded and is ready to be compacted.
             * Saves data back to disk immediately on success,
             * calls handler (if any) immediately on error.
             * @param {function} handler
             * @param {object} err
             * @param {object} data
             * @private
             */
            _onCompact: function (handler, err, data) {
                dessert.assert(!err, "Error reading file", err);

                fs.writeFile(
                    this.fileName,
                    JSON.stringify(data).slice(1, -1) + ',',
                    handler.bind(this)
                );
            }
        })
        .addMethods(/** @lends lightstore.Rjson# */{
            /**
             * Initializes RJSON.
             * @param {string} fileName Name of database file.
             */
            init: function (fileName) {
                /**
                 * @constant
                 * @type {string}
                 */
                this.fileName = fileName;

                var ext = path.extname(this.fileName);

                this.fileType = ext === '.json' ?
                    this.TYPE_JSON :
                    this.TYPE_RJSON;
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
                    this.fileType === this.TYPE_JSON ?
                        this._onJsonRead.bind(this, handler) :
                        this._onRjsonRead.bind(this, handler)
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

                this.read(this._onCompact.bind(this, handler));

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

                fs.appendFile(
                    this.fileName,
                    JSON.stringify(data).slice(1, -1) + ',',
                    typeof handler === 'function' ?
                        handler.bind(this) :
                        undefined
                );

                return this;
            }
        });
});
