/*global dessert, troop, sntls, lightstore */
/*jshint node:true */
troop.postpone(lightstore, 'PersistedTree', function () {
    "use strict";

    var base = sntls.Tree;

    /**
     * @name lightstore.PersistedTree.create
     * @function
     * @param {string} fileName
     * @param {object} items
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
             * @param {function} [handler]
             * @param {Error} err
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
             * @param {object} items
             * @ignore
             */
            init: function (fileName, items) {
                base.init.call(this, items);

                /**
                 * @type {lightstore.File}
                 */
                this.file = lightstore.File.create(fileName);
            },

            /**
             * @param {function} [handler]
             * @returns {lightstore.PersistedTree}
             */
            load: function (handler) {
                this.file.read(this._onRead.bind(this, handler));
                return this;
            },

            /**
             * Saves datastore contents to a different file.
             * Useful when opening unsupported file types (JSON, RJSON).
             * @param {string} fileName Name of new file
             * @param {function} [handler]
             * @returns {lightstore.PersistedTree}
             */
            saveAs: function (fileName, handler) {
                lightstore.KeyValueStore.create(fileName)
                    .write([].toPath(), this.items, handler);
                return this;
            },

            /**
             * Saves datastore to file, compacted.
             * @param {function} [handler]
             * @returns {lightstore.PersistedTree}
             */
            save: function (handler) {
                this.saveAs(this.file.fileName, handler);
                return this;
            },

            /**
             * @param {sntls.Path} path Path to node
             * @param {*} value Node value to set
             * @returns {lightstore.PersistedTree}
             */
            setNode: function (path, value) {
                base.setNode.call(this, path, value);

                var file = this.file;
                if (file.isA(lightstore.KeyValueStore)) {
                    // persisting node
                    file.write(path, value);
                } else {
                    process.stdout.write("Change not written to file. Save contents to new file via `ls.saveAs()`.\n");
                }

                return this;
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isPersistedTree: function (expr) {
            return lightstore.PersistedTree.isBaseOf(expr);
        },

        isPersistedTreeOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   lightstore.PersistedTree.isBaseOf(expr);
        }
    });

    sntls.Hash.addMethods(/** @lends sntls.Hash# */{
        /**
         * Reinterprets hash as a persisted tree.
         * @param {string} fileName
         * @returns {sntls.Tree}
         */
        toPersistedTree: function (fileName) {
            return lightstore.PersistedTree.create(fileName, this.items);
        }
    });
}());
