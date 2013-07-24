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
             * @param {object} err
             * @param {object} json
             * @private
             */
            _onRead: function (err, json) {
                this.items = json;
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
                this._store = lightstore.KeyValueStore.create(fileName)
                    .read(this._onRead.bind(this));
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
