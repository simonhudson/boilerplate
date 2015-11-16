/*
Ajax Service
*/
var Ajax = {

    doCall: function (options, formObj) {
        var ajaxOptions = Ajax.setOptions(options);

        $.ajax({
            async:          ajaxOptions.async,
            beforeSend:     ajaxOptions.beforeSend,
            cache:          ajaxOptions.cache,
            contentType:    ajaxOptions.contentType,
            crossDomain:    ajaxOptions.crossDomain,
            data:           ajaxOptions.data,
            dataType:       ajaxOptions.dataType,
            global:         ajaxOptions.global,
            ifModified:     ajaxOptions.ifModified,
            method:         ajaxOptions.method,
            processData:    ajaxOptions.processData,
            timeout:        ajaxOptions.timeout,
            url:            ajaxOptions.url,
            success: function(data, textStatus, jqXHR) {
                ajaxOptions.success(data, textStatus, jqXHR, formObj);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                ajaxOptions.error();
            },
            complete: function() {
                ajaxOptions.complete();
            }
        });

    },

    loadContent: function(target, url) {
        target.load(url);
    },

    setOptions: function(options) {

        var ajaxOptions = {};
            ajaxOptions.async           = typeof options.async          != 'undefined' ? options.async : true;
            ajaxOptions.beforeSend      = typeof options.beforeSend     != 'undefined' ? options.beforeSend : null;
            ajaxOptions.cache           = typeof options.cache          != 'undefined' ? options.cache : true;
            ajaxOptions.complete        = typeof options.complete       != 'undefined' ? options.complete : Ajax.defaultCompleteCallback;
            ajaxOptions.contentType     = typeof options.contentType    != 'undefined' ? options.contentType : 'application/x-www-form-urlencoded; charset=UTF-8';
            ajaxOptions.crossDomain     = typeof options.crossDomain    != 'undefined' ? options.crossDomain : false;
            ajaxOptions.data            = typeof options.data           != 'undefined' ? options.data : null;
            ajaxOptions.dataType        = typeof options.dataType       != 'undefined' ? options.dataType : 'json';
            ajaxOptions.error           = typeof options.error          != 'undefined' ? options.error : Ajax.defaultErrorCallback;
            ajaxOptions.global          = typeof options.global         != 'undefined' ? options.global : true;
            ajaxOptions.ifModified      = typeof options.ifModified     != 'undefined' ? options.ifModified : false;
            ajaxOptions.method          = typeof options.method         != 'undefined' ? options.method : 'get';
            ajaxOptions.processData     = typeof options.processData    != 'undefined' ? options.processData : true;
            ajaxOptions.success         = typeof options.success        != 'undefined' ? options.success : Ajax.defaultSuccessCallback;
            ajaxOptions.timeout         = typeof options.timeout        != 'undefined' ? options.timeout : null;
            ajaxOptions.url             = typeof options.url            != 'undefined' ? options.url : null;

        return ajaxOptions;

    },

    defaultSuccessCallback: function(data, textStatus, jqXHR) {
        return;
    },

    defaultErrorCallback: function() {
        GenericError.show();
    },

    defaultCompleteCallback: function() {
    }

};