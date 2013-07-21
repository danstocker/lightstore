/*global troop */
/*jshint browser:true, node:true */
(function () {
    'use strict';

    var modules = troop.Base.extend()
        .addPublic({
            fs: troop.Base.extend()
        });

    window.require = function (module) {
        return window[module.split(/\W+/).pop()] || modules[module];
    };
}());
