/*global dessert, troop, sntls, lightstore */
troop.postpone(lightstore, 'PersistedTree', function () {
    "use strict";

    var base = sntls.Tree;

    /**
     * @name lightstore.PersistedTree.create
     * @function
     * @param {string} fileName
     * @returns {lightstore.PersistedTree}
     */

    /**
     * @class
     * @extends {sntls.Tree}
     */
    lightstore.PersistedTree = base.extend()
        .addPrivateMethods(/** @lends lightstore.PersistedTree */{
            /**
             * Called when datastore finished loading.
             * Assigns input json to Tree buffer.
             * @param {function} handler
             * @param {object} err
             * @param {object} json
             * @private
             */
            _onRead: function (handler, err, json) {
                this.items = json;
                if (handler) {
                    handler(err, json);
                }
            }
        })
        .addMethods(/** @lends lightstore.PersistedTree# */{
            /**
             * @param {string} fileName
             * @ignore
             */
            init: function (fileName) {
                base.init.call(this);

                /**
                 * @type {lightstore.KeyValueStore}
                 * @private
                 */
                this._store = lightstore.KeyValueStore.create(fileName);
            },

            /**
             * @param {function} handler
             * @returns {lightstore.PersistedTree}
             */
            read: function (handler) {
                this._store.read(this._onRead.bind(this, handler));
                return this;
            },

            /**
             * @param {sntls.Path} path Path to node
             * @param {*} value Node value to set
             * @returns {lightstore.PersistedTree}
             */
            setNode: function (path, value) {
                base.setNode.call(this, path, value);

                // persisting node
                this._store.write(path, value);

                return this;
            }
        });
});
