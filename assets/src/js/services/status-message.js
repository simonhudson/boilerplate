/*
Status Message
*/

var StatusMessage = {
  
    selector: 'status-msg',

    create: function(type, text, attachTo, location, hasIcon, isBox, title, isFlash) {
        var icon;

        switch(type) {
            case 'error':
                icon = 'fa-times-circle';
                break;
            case 'success':
                icon = 'fa-check-circle';
                break;
            case 'warning':
                icon = 'fa-exclamation-triangle';
                break;
            case 'info':
                icon = 'fa-info-circle';
                break;
        }
        var iconElement = hasIcon ? '<span class="fa fa-lg ' + icon + ' margin-r-sm"></span>' : '',
            isBoxSelector = isBox ? StatusMessage.selector + '--is-box' : '',
            titleElement = title ? '<span class="' + StatusMessage.selector + '__title">' + title + '</span>' : '';

        var statusMessage = $(
            '<span class="' + StatusMessage.selector + ' ' + StatusMessage.selector + '--is-' + type + ' ' + isBoxSelector + '">' + iconElement + titleElement + '<span class="' + StatusMessage.selector + '__body">' + text + '</span></span>'
        );
        if (!attachTo.find('.' + StatusMessage.selector).length) {
            if (location === 'prepend')
                attachTo.prepend(statusMessage);
            if (location === 'append')
                attachTo.append(statusMessage);
            if (location === 'before')
                attachTo.before(statusMessage);
            if (location === 'after')
                attachTo.after(statusMessage);
        }
    },

    remove: function(removeFrom) {
        if (removeFrom.find('.' + StatusMessage.selector).length)
            removeFrom.find('.' + StatusMessage.selector).remove();
    }

};