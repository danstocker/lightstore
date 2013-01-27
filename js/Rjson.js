/**
 * Redundant JSON I/O
 *
 * RJSON may contain the same key several times over. Upon parsing,
 * the last value (which is also the latest) will be used.
 */
(function (fs, dessert, troop) {
    var self = exports.Rjson = troop.Base.extend()
        .addMethod({
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
                dessert.isFunction(handler);

                var that = this;

                fs.readFile(that.fileName, function (err, data) {
                    var parsed;

                    if (!err) {
                        try {
                            parsed = JSON.parse('{' + data.toString().slice(0, -1) + '}');
                        } catch (e) {
                            err = new Error("Corrupted database contents.");
                        }
                    }

                    handler.call(that, err, parsed);
                });

                return this;
            },

            /**
             * Compacts database files.
             * @param [handler] {function} Callback
             */
            compact: function (handler) {
                dessert.isFunctionOptional(handler);

                var that = this;

                this.read(function (err, data) {
                    if (err) {
                        if (typeof handler === 'function') {
                            handler.call(that, err);
                        }
                    } else {
                        fs.writeFile(that.fileName, JSON.stringify(data).slice(1, -1) + ',', function () {
                            if (typeof handler === 'function') {
                                handler.apply(that, arguments);
                            }
                        });
                    }
                });

                return this;
            },

            /**
             * Writes object to database.
             * @param data {object}
             * @param [handler] {function} Callback
             */
            write: function (data, handler) {
                dessert
                    .isObject(data)
                    .isFunctionOptional(handler);

                var that = this;

                fs.appendFile(that.fileName, JSON.stringify(data).slice(1, -1) + ',', function () {
                    if (typeof handler === 'function') {
                        handler.apply(that, arguments);
                    }
                });

                return that;
            }
        });
}(
    require('fs'),
    require('dessert-0.2.3').dessert,
    require('troop-0.2.3').troop
));
