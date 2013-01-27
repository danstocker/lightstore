/*global troop */
(function () {
    // registry of fake modules
    var modules = {};

    this.require = function (moduleName) {
        var module;
        if (modules.hasOwnProperty(moduleName)) {
            return modules[moduleName];
        } else {
            module = troop.Base.extend();
            modules[moduleName] = module;
            return module;
        }
    };
}());
