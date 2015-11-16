/*
Show/hide
*/

var ShowHide = {

    selectors: {
        content:        'data-showhide-content',
        target:         'data-showhide-target',
        openDefault:    'data-showhide-open-default',
        isOpen:         '--is-open',
        active:         'active'
    },

    init: function() {
        var showHideObj = {
            toggle: $(this),
            content: $('[' + ShowHide.selectors.content + '=' + $(this).attr(ShowHide.selectors.target) + ']')
        };

        if (showHideObj.content.attr(ShowHide.selectors.openDefault) !== 'true')
            showHideObj.content.hide();

        ShowHide.eventListeners(showHideObj);
    },

    eventListeners: function(showHideObj) {
        showHideObj.toggle.on('click', function(event) {
            ShowHide.doToggle(showHideObj);
            return false;
        });
    },

    doToggle: function(showHideObj) {
        showHideObj.content.slideToggle();
        showHideObj.toggle.toggleClass(ShowHide.selectors.active);
        ShowHide.handleBodyClass(showHideObj.content.attr(ShowHide.selectors.content));
    },

    handleBodyClass: function(classToToggle) {
        classToToggle = classToToggle + ShowHide.selectors.isOpen;
        $('body').toggleClass(classToToggle);
    },

    hideElement: function(element) {
        if (element.is(':visible')) {
            var selector = element.attr(ShowHide.selectors.content);
            element.slideUp();
            $('body').removeClass(selector + ShowHide.selectors.isOpen);
            $('[' + ShowHide.selectors.target + '=' + selector + ']').removeClass(ShowHide.selectors.active);
        }
    }

};
$('[data-showhide-target]').each(ShowHide.init);