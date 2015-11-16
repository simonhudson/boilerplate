/*
Modal overlay
*/
var Modal = {

    displayModalAt: 800,
    fullScreenSelector: 'js-modal__overlay--full-screen',

    init: function() {
        $('.js-modal__trigger').each(function() {
            $(this).on('click', function() {
                modalObj = {
                    overlay: $('.js-modal__overlay'),
                    trigger: $(this),
                    openBodyClass: 'no-scroll',
                    url: $(this).data('modal-content')
                };
                Modal.handleViewportViews(modalObj);
                return Window.getViewportWidth() <= Modal.displayModalAt;
            });
        });
    },

    handleViewportViews: function(modalObj) {
        if (Window.getViewportWidth() > Modal.displayModalAt)
            Modal.createModal(modalObj);
    },

    createModal: function(modalObj) {
        Loading.showLoader();
        modalObj.overlay.addClass('is-open');
        modalObj.overlay.prepend('<div class="js-modal__content-wrap"><div class="js-modal__content"></div></div>');
        modalObj.contentWrap = $('.js-modal__content-wrap');
        modalObj.content = $('.js-modal__content');
        modalObj.overlay.height(Math.max($(document).height(), $(window).height()));
        Modal.preventScrolling(modalObj);
    },

    preventScrolling: function(modalObj) {
        $('body').addClass(modalObj.openBodyClass);
        Modal.getContent(modalObj);
    },

    getContent: function(modalObj) {
        Loading.showLoader(modalObj.contentWrap);
        var contentToLoad;
        $.ajax({
            url: modalObj.url,
            type: 'get',
            success: function(data) {
                contentToLoad = $(data).find('.js-modal__content-to-load').html();
                Modal.loadContent(modalObj, contentToLoad);
            },
            error: function() {
                StatusMessage.create('error', modalObj.trigger.data('modal-load-error'), modalObj.content, 'prepend', true, true);
            },
            complete: function() {
                Loading.removeLoader(modalObj.contentWrap);
                Modal.createClose(modalObj);
                Modal.setFocusOnLoad(modalObj);
                Modal.setModalDimensions(modalObj);
            }
        });
    },

    loadContent: function(modalObj, contentToLoad) {
        modalObj.content.html(contentToLoad);
    },

    setModalDimensions: function(modalObj) {
        modalObj.contentWrap.width(Window.getViewportWidth() - ((Window.getViewportWidth() * 10) / 100));
        modalObj.contentWrap.height(Window.getViewportHeight() - ((Window.getViewportHeight() * 25) / 100));
    },

    createClose: function(modalObj) {
        modalObj.contentWrap.prepend('<a class="js-modal__close" href="#"><span class="fa fa-times fa-lg"><span class="hidden">Close</span></span></a>');
        modalObj.close = $('.js-modal__close');
    },

    setFocusOnLoad: function(modalObj) {
        modalObj.close.eq(0).focus();
        modalObj.close.on('click', function() {
            Modal.closeModal(modalObj);
            return false;
        });
        $(document).on('keyup', function(e) {
            if (e.keyCode === 27) {
                Modal.closeModal(modalObj);
                return false;
            }
        });
    },

    closeModal: function(modalObj) {
        modalObj.contentWrap.html('');
        modalObj.contentWrap.remove();
        modalObj.overlay.removeClass('is-open');
        Modal.returnFocusToTrigger(modalObj);
        Modal.enableScrolling(modalObj);
    },

    returnFocusToTrigger: function(modalObj) {
        modalObj.trigger.focus();
    },

    enableScrolling: function(modalObj) {
        $('body').removeClass(modalObj.openBodyClass);
    }

};

$(document).ready(Modal.init);