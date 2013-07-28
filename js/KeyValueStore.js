/*global dessert, troop, sntls, lightstore */
troop.postpone(lightstore, 'KeyValueStore', function () {
    "use strict";

    var base = lightstore.Rjson,
        self = base.extend();

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
    lightstore.KeyValueStore = self
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
             * @param {object[]} keyValuePairs
             * @return {object}
             * @private
             * @memberOf lightstore.KeyValueStore
             */
            _consolidateTree: function (keyValuePairs) {
                var output = sntls.Tree.create(),
                    i, keyValuePair;

                for (i = 0; i < keyValuePairs.length; i++) {
                    keyValuePair = keyValuePairs[i];
                    output.setNode(keyValuePair.k.toPath(), keyValuePair.v);
                }

                return [
                    {k: this.ROOT_KEY, v: output.items[this.ROOT_KEY] || {}}
                ];
            },

            /**
             * Called when Rjson finishes loading.
             * @param {function} handler
             * @param {Error} err
             * @param {object} json
             * @private
             */
            _onRead: function (handler, err, json) {
                handler(err, self._consolidateTree.call(this, json || []));
            }
        })
        .addMethods(/** @lends lightstore.KeyValueStore# */{
            /**
             * Reads datastore contents and passes it to handler.
             * @param {function} handler
             * @returns {lightstore.KeyValueStore}
             */
            read: function (handler) {
                base.read.call(this, self._onRead.bind(this, handler));
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
                var buffer = [
                    {
                        k: path
                            .prepend(this.ROOT_PATH)
                            .toString(),

                        v: value
                    }
                ];

                base.write.call(this, buffer, handler);

                return this;
            }
        });
});
