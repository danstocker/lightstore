/*global dessert, troop, sntls, radiant */
troop.postpone(radiant, 'KeyValueStore', function () {
    "use strict";

    var base = radiant.Rjson;

    /**
     * @name radiant.KeyValueStore.create
     * @function
     * @param {string} fileName
     * @returns {radiant.KeyValueStore}
     */

    /**
     * @class
     * @extends radiant.Rjson
     */
    radiant.KeyValueStore = base.extend()
        .addMethods(/** @lends radiant.KeyValueStore# */{
            /**
             * Writes a value to a path.
             * @param {sntls.Path} path
             * @param {*} value
             * @param {function} [handler]
             */
            write: function (path, value, handler) {
                var buffer = {};

                buffer[path.toString()] = JSON.stringify(value);

                base.write.call(this, buffer, handler);

                return this;
            }
        });
});
