$.ajaxSetup({
    beforeSend: function(xhr) {
        Loading.showLoader();
        xhr.getAllResponseHeaders();
    },
    success: function() {
        Loading.removeLoader();
    },
    contentType: "application/json; charset=utf-8"
});
$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    options.crossDomain = {
        crossDomain: true
    };
});