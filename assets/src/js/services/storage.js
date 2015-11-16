var LocalStorage = {
  
    hasLocalStorage: function() {
        return 'localStorage' in window && window['localStorage'] !== null;
    },

    set: function(key, value) {
        if (LocalStorage.hasLocalStorage())
            localStorage.setItem(key, value);
    },

    get: function(key) {
        if (LocalStorage.hasLocalStorage())
            return localStorage.getItem(key);
    },

    remove: function(key) {
        if (LocalStorage.hasLocalStorage())
            localStorage.removeItem(key);
    },

    clearAll: function() {
        if (LocalStorage.hasLocalStorage())
            localStorage.clear();
    }

};