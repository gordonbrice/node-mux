exports.StorageService = (function () {
    var instance;

    function createInstance() {
        var object = new Object();

        object.blockNumber = "";
        return object;
    }

    return { // public interface
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }

            return instance;
        },
    };
})();