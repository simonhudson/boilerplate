/*
Loading
*/
var Loading = {

    loadingImgSelector: 'loading__img',

    showLoader: function(attachTo) {

        if (!attachTo)
            attachTo = $('.' + Modal.fullScreenSelector);

        if (!attachTo.find('.' + Loading.loadingImgSelector).length) {
            attachTo.prepend('<div class="' + Loading.loadingImgSelector + '"><span class="fa fa-spinner fa-pulse fa-2x"></span><p>Please wait</p></div>');
            $('.' + Modal.fullScreenSelector).addClass('is-open');
        }

    },

    removeLoader: function(removeFrom) {
        $('.' + Loading.loadingImgSelector).remove();
        $('.' + Modal.fullScreenSelector).removeClass('is-open');
    }

};