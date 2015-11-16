/*
Utilities
*/
var Utils = {

    classes: {
        isDisabled: 'is-disabled'
    },

    toggleDisabledState: function(elements, isDisabled, omitClass) {
        for (var i=0; i < elements.length; i++) {
            elements[i].attr('disabled', isDisabled);
            elements[i].on('click', !isDisabled);
            if (!omitClass) {
                if (isDisabled === true) {
                    elements[i].addClass(Utils.classes.isDisabled);
                } else {
                    elements[i].removeClass(Utils.classes.isDisabled);
                }
            }
        }
    },

    enableElements: function(elements) {
        for(var i=0; i < elements.length; i++) {
            elements[i].attr('disabled', false);
            elements[i].removeClass(Utils.classes.isDisabled);
        }
    },

    disableElements: function(elements) {
        for(var i=0; i < elements.length; i++) {
            elements[i].attr('disabled', true);
            elements[i].addClass(Utils.classes.isDisabled);
        }
    },

    uppercaseFirstLetter: function(string) {
        string = string.toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    checkValuesMatch: function(value1, value2) {
        return value1 === value2 ? true : false;
    },

    emptyIfNull: function(string) {
        return string ? string : '';
    },

    addLeadingZero: function(value) {
        value = value.toString();
        if (value.length < 2) {
            value = '0' + value;
        }
        return value;
    },

    fadeOutAndRemoveElement: function(element) {
        element.animate({
            opacity: 0
        }, 400, function() {
            $(this).remove();
        });
    },

    convertImageToBase64: function(file, callback) {
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
            callback(e.target.result);
        };
        fileReader.readAsDataURL(file);
    }
    
};
