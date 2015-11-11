var instance = {
    enabled: false,
    target: console
};

instance.log = gate('log');
instance.info = gate('info');
instance.error = gate('error');

function gate(property) {
    return function() {
        if (!instance.enabled) {
            return;
        }

        var fn = instance.target[property];
        if (typeof fn === 'function') {
            fn.apply(instance, arguments);
        } else {
            throw `${property} is not a function on ${instance}`;
        }
    }
}

module.exports = instance;