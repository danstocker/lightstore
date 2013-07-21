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
        .addPrivateMethods(/** @lends radiant.KeyValueStore# */{
            /**
             * Converts contents (serialized paths - values) to a proper tree.
             * @param {object} json
             * @return {object}
             * @private
             * @memberOf radiant.KeyValueStore
             */
            _convertToTree: function (json) {
                var input = sntls.Collection.create(json),
                    output = sntls.Tree.create();

                input.forEachItem(function (value, pathStr) {
                    output.setNode(pathStr.toPath(), value);
                });

                return output.items;
            },

            /**
             * Called when Rjson finishes loading.
             * @param {function} handler
             * @param {object} err
             * @param {object} json
             * @private
             */
            _onRead: function (handler, err, json) {
                handler(err, this._convertToTree(json));
            }
        })
        .addMethods(/** @lends radiant.KeyValueStore# */{
            /**
             * Reads datastore contents and passes it to handler.
             * @param {function} handler
             * @returns {radiant.KeyValueStore}
             */
            read: function (handler) {
                base.read(this._onRead.bind(this, handler));
                return this;
            },

            /**
             * Writes a value to a path.
             * @param {sntls.Path} path
             * @param {*} value
             * @param {function} [handler]
             * @returns {radiant.KeyValueStore}
             */
            write: function (path, value, handler) {
                var buffer = {};

                buffer[path.toString()] = JSON.stringify(value);

                base.write.call(this, buffer, handler);

                return this;
            }
        });
});
