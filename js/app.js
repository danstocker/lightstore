/**
 * Base Application Class
 */
var troop = require('troop-0.1.3').troop,
    rjson = require('./rjson').rjson,
    stdout = process.stdout,
    app;

app = troop.base.extend({
    //////////////////////////////
    // OOP

    /**
     *
     * @param fileName
     */
    init: function (fileName) {
        if (!fileName) {
            app.ok("Usage: node radiant fileName [command] [data]");
            process.exit();
        }

        /**
         * Database file name
         * @type {string}
         */
        this.fileName = fileName;

        /**
         * Database object
         * @type {rjson}
         */
        this.dataStore = rjson.create(fileName);
    },

    //////////////////////////////
    // Utils

    /**
     * Outputs an error message to stdio.
     * @static
     * @param err {Error|string}
     */
    error: function (err) {
        if (typeof err === 'string') {
            err = new Error(err);
        }
        stdout.write(err.toString() + "\n");
    },

    /**
     * Outputs a message to stdio.
     * @static
     * @param message {string}
     */
    ok: function (message) {
        stdout.write(message + "\n");
    },

    //////////////////////////////
    // Datastore methods

    /**
     * Reads database and outputs contents.
     */
    read: function () {
        this.dataStore.read(function (err, data) {
            if (err) {
                app.error(err);
            } else {
                app.ok(JSON.stringify(data, null, 2));
            }
        });
    },

    /**
     * Compacts database.
     */
    compact: function () {
        this.dataStore.compact(function (err) {
            if (err) {
                app.error(err);
            } else {
                app.ok("Datastore compacted.");
            }
        });
    },

    /**
     * Writes data to database.
     * @param data {object}
     */
    write: function (data) {
        if (typeof data !== 'undefined') {
            var parsed;
            try {
                parsed = JSON.parse(data);
                this.dataStore.write(parsed, function () {
                    app.ok("Data written.");
                });
            } catch (e) {
                app.error("Invalid JSON");
            }
        }
    }
});

exports.app = app;
