var Window = {

    resize: function(callback, timeout) {
       
        /*
        To call:

        Window.resize(function() {
            callbackFunction();
        }, [optional timeout value] );

        */

        var id;

        if (!timeout)
            timeout = 200;

        $(window).resize(function() {
            clearTimeout(id);
            id = setTimeout(callback, timeout);
        });

    },

    getViewportWidth: function() {
        return window.innerWidth;
    },

    getViewportHeight: function() {
        return window.innerHeight;
    }
    
};