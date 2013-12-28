/*global dessert, troop, sntls, lightstore */
/*jshint node:true */
troop.postpone(lightstore, 'PersistedTree', function () {
    "use strict";

    var base = sntls.Tree,
        self = base.extend();

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
    lightstore.PersistedTree = self
        .addPrivateMethods(/** @lends lightstore.PersistedTree# */{
            /**
             * Called when datastore finished loading.
             * Assigns input json to Tree buffer.
             * @param {function} [handler]
             * @param {Error} err
             * @param {object} json
             * @private
             */
            _onRead: function (handler, err, json) {
                var items;

                if (!err) {
                    // assigning items from file when file exists
                    items = this.file.isA(lightstore.KeyValueStore) ?
                        json[0].v :
                        json;

                    this.items = items;
                }

                if (handler) {
                    handler(err, items);
                }
            },

            /**
             * Writes node to file when storage is KeyValueStore. Displays a message otherwise.
             * @param {sntls.Path} path
             * @param {*} value
             * @param {function} handler
             * @private
             */
            _write: function (path, value, handler) {
                var file = this.file;
                if (file.isA(lightstore.KeyValueStore)) {
                    // persisting node
                    file.write(value, handler, path);
                } else {
                    process.stdout.write("Change not written to file. Save contents via `ls.save()` or `ls.saveAs()`.\n");
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
                this.file.read(self._onRead.bind(this, handler));
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
                lightstore.File.create(fileName)
                    .write(this.items, handler);
                return this;
            },

            /**
             * Saves datastore to file, compacted.
             * @param {function} [handler]
             * @returns {lightstore.PersistedTree}
             */
            save: function (handler) {
                this.file.write(this.items, handler);
                return this;
            },

            /**
             * @param {sntls.Path} path
             * @param {function} [handler]
             * @returns {*}
             */
            getSafeNode: function (path, handler) {
                var that = this;

                return base.getSafeNode.call(this, path, function (path, value) {
                    that._write(path, value, handler);
                });
            },

            /**
             * @param {sntls.Path} path
             * @param {function} generator
             * @param {function} [handler]
             * @returns {*}
             */
            getOrSetNode: function (path, generator, handler) {
                var that = this;

                return base.getOrSetNode.call(this, path, generator, function (path, value) {
                    that._write(path, value, handler);
                });
            },

            /**
             * @param {sntls.Path} path Path to node
             * @param {*} value Node value to set
             * @param {function} [handler]
             * @returns {lightstore.PersistedTree}
             */
            setNode: function (path, value, handler) {
                base.setNode.call(this, path, value);
                this._write(path, value, handler);
                return this;
            },

            /**
             * @param {sntls.Path} path
             * @param {function} [handler]
             */
            unsetNode: function (path, handler) {
                base.unsetNode.call(this, path);
                this._write(path, undefined, handler);
                return this;
            },

            /**
             * @param {sntls.Path} path
             * @param {boolean} [splice=false]
             * @param {function} [handler]
             */
            unsetKey: function (path, splice, handler) {
                var that = this;

                base.unsetKey.call(this, path, splice, function (affectedPath, value) {
                    that._write(affectedPath, value, handler);
                });

                return this;
            },

            /**
             * @param {sntls.Path} path
             * @param {boolean} [splice=false]
             * @param {function} [handler]
             * @returns {*}
             */
            unsetPath: function (path, splice, handler) {
                var that = this;

                base.unsetPath.call(this, path, splice, function (affectedPath, value) {
                    that._write(affectedPath, value, handler);
                });

                return this;
            }
        });
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

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
}());
