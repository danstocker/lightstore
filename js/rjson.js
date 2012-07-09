/**
 * Redundant JSON I/O
 *
 * RJSON may contain the same key several times over. Upon parsing,
 * the last value (which is also the latest) will be used.
 */
var fs = require('fs'),
    troop = require('troop-0.1.3').troop,
    rjson;

rjson = troop.base.extend({
    //////////////////////////////
    // OOP

    /**
     * Initializes RJSON.
     * @param fileName {string} Name of database file.
     */
    init: function (fileName) {
        this.fileName = fileName;
    },

    //////////////////////////////
    // Datastore methods

    /**
     * Reads the whole RJSON database file.
     * @param handler {function} Callback
     */
    read: function (handler) {
        fs.readFile(this.fileName, function (err, data) {
            var parsed;
            if (typeof handler === 'function') {
                if (!err) {
                    try {
                        parsed = JSON.parse('{' + data.toString().slice(0, -1) + '}');
                    } catch (e) {
                        err = new Error("Corrupted database contents.");
                    }
                }
                handler(err, parsed);
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
            if (err) {
                if (typeof handler === 'function') {
                    handler(err);
                }
            } else {
                fs.writeFile(that.fileName, JSON.stringify(data).slice(1, -1) + ',', handler);
            }
        });
        return this;
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
