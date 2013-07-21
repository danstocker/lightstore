/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/Rjson.js',
            'js/KeyValueStore.js',
            'js/exports.js'
        ],

        test: [
            'js/jsTestDriver.conf'
        ],

        globals: {
            dessert: true,
            troop  : true,
            sntls  : true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
