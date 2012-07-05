/**
 * Redundant JSON I/O
 *
 * RJSON may contain the same key several times over. Upon parsing,
 * the last value (which is also the latest) will be used.
 */
var fs = require('fs'),
    troop = require('../lib/troop/troop-0.1.3').troop,
    rjson;

rjson = troop.base.extend()
    .addMethod({
        /**
         * Initializes RJSON.
         * @param fileName {string} Name of database file.
         */
        init: function (fileName) {
            this.fileName = fileName;
        },

        /**
         * Reads the whole RJSON database file.
         * @param handler {function} Callback
         * @return {object} Database contents.
         */
        read: function (handler) {
            fs.readFile(this.fileName, function (err, data) {
                if (typeof handler === 'function') {
                    handler(err, JSON.parse('{' + data.toString().slice(0, -1) + '}'));
                }
            });
            return this;
        },

        /**
         * Compacts database files.
         * @param handler {function} Callback
         */
        compact: function (handler) {
            var that = this;
            this.read(function (err, data) {
                fs.writeFile(that.fileName, JSON.stringify(data).slice(1, -1) + ',', handler);
            });
        },

        /**
         * Writes object to database.
         * @param data {object}
         * @param handler {function} Callback
         */
        write: function (data, handler) {
            fs.appendFile(this.fileName, JSON.stringify(data).slice(1, -1) + ',', handler);
            return this;
        }
    });

exports.rjson = rjson;
