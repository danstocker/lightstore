/*global dessert, troop, sntls, lightstore */
troop.postpone(lightstore, 'KeyValueStore', function () {
    "use strict";

    var base = lightstore.Rjson;

    /**
     * @name lightstore.KeyValueStore.create
     * @function
     * @param {string} fileName
     * @returns {lightstore.KeyValueStore}
     */

    /**
     * @class
     * @extends lightstore.Rjson
     */
    lightstore.KeyValueStore = base.extend()
        .addConstants(/** @lends lightstore.KeyValueStore */{
            /**
             * @type {string}
             */
            ROOT_KEY: 'root',

            /**
             * @type {sntls.Path}
             */
            ROOT_PATH: sntls.Path.create('root')
        })
        .addPrivateMethods(/** @lends lightstore.KeyValueStore# */{
            /**
             * Compacts buffer (serialized paths - values) to a tree with one (root) key.
             * @param {object} json
             * @return {object}
             * @private
             * @memberOf lightstore.KeyValueStore
             */
            _compactBuffer: function (json) {
                var output = sntls.Tree.create(),
                    keys = Object.keys(json),
                    i, key;

                for (i = 0; i < keys.length; i++) {
                    key = keys[i];
                    output.setNode(key.toPath(), json[key]);
                }

                return output.items;
            },

            /**
             * Called when Rjson finishes loading.
             * @param {function} handler
             * @param {Error} err
             * @param {object} json
             * @private
             */
            _onRead: function (handler, err, json) {
                handler(err, json ? this._compactBuffer(json)[this.ROOT_KEY] : {});
            }
        })
        .addMethods(/** @lends lightstore.KeyValueStore# */{
            /**
             * Reads datastore contents and passes it to handler.
             * @param {function} handler
             * @returns {lightstore.KeyValueStore}
             */
            read: function (handler) {
                base.read.call(this, this._onRead.bind(this, handler));
                return this;
            },

            /**
             * Writes a value to a path.
             * @param {sntls.Path} path
             * @param {*} value
             * @param {function} [handler]
             * @returns {lightstore.KeyValueStore}
             */
            write: function (path, value, handler) {
                var buffer = {},
                    key = path
                        .prepend(this.ROOT_PATH)
                        .toString();

                buffer[key] = value;

                base.write.call(this, buffer, handler);

                return this;
            }
        });
});
