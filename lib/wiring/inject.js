var instance = {};

module.exports = function(moduleName, override) {
    if(override === null) {
        delete instance[moduleName];
    }

    var value = override || instance[moduleName] || require(moduleName);

    instance[moduleName] = value;

    return value;
}
