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
             * @param {object} json
             * @private
             */
            _onRead: function (handler, json) {
                this.items = json;
                if (handler) {
                    handler(json);
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
                 * @type {lightstore.File}
                 * @private
                 */
                this._store = lightstore.File.create(fileName);
            },

            /**
             * @param {function} handler
             * @returns {lightstore.PersistedTree}
             */
            load: function (handler) {
                this._store.read(this._onRead.bind(this, handler));
                return this;
            },

            /**
             * Saves datastore contents to a different file.
             * Useful when opening unsupported file types (JSON, RJSON).
             * @param {string} fileName Name of new file
             * @param {function} handler
             * @returns {lightstore.PersistedTree}
             */
            saveAs: function (fileName, handler) {
                lightstore.KeyValueStore.create(fileName)
                    .write([].toPath(), this.items, handler);
                return this;
            },

            /**
             * @param {sntls.Path} path Path to node
             * @param {*} value Node value to set
             * @returns {lightstore.PersistedTree}
             */
            setNode: function (path, value) {
                base.setNode.call(this, path, value);

                var store = this._store;
                if (store.isA(lightstore.KeyValueStore)) {
                    // persisting node
                    store.write(path, value);
                }

                return this;
            }
        });
});
