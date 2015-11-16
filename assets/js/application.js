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
/*
Employees
*/
var Employees = {
  
    getAll: function(options) {
        Ajax.doCall(options);
    },

    displayData: function(data) {
        var dataElement = $('.js-employees__list');
        dataElement.html('');
        for (var i in data) {
            var dataItem ='<li><strong>' + data[i].lastname + ', ' + data[i].firstname + ' ' + data[i].middlename + '</strong><br />' + data[i].location + '</li>';
            dataElement.append(dataItem);
        }
    }

};

$('[data-ajax=get--employees]').on('click', function() {
    var options = {
        url: 'sql/get-employees.php',
        success: Employees.displayData
    };
    Ajax.doCall(options);
});
/*
Generic error */
var GenericError = {
  
    show: function(attachTo) {
        attachTo = attachTo ? attachTo : $('body');
        StatusMessage.create('error', 'An error occurred, please try again.', attachTo, 'prepend', true, true);
    }

};
var hasJs = {

    init: function() {
        $('html').addClass('has-js');
    }

};
$(document).ready(hasJs.init);
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
/*
Prevent page jump
*/
$('[href="#"], [href=""]').on('click', function() {
    return false;
});
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
function tabbedContent() {

    var
        $tabbedContentWrap = $('.js-tabs__wrap'),
        $tabContent = $('.js-tabs__content'),
        $tabTitle = $('.js-tabs__title')
    ;

    $('.js-tabs__title, .js-tabs__content').hide();
    $tabContent.eq(0).show();

    //Add class for JS specific styling
    $tabbedContentWrap.addClass('js-on');

    //Create tab links
    $tabbedContentWrap.prepend('<ul class="js-tabs__list"></ul>');
    var tabLinks = [];
    $tabTitle.each(function() {
        tabLinks.push($(this).text());
    });
    var count = 0;
    for (i = 0; i < tabLinks.length; i++) {
        $tabbedContentWrap.children('ul.js-tabs__list').append('<li class="js-tabs__item"><a href="#" class="js-tabs__link" data-tabs-target="js-tab-' + count++ + '">' + tabLinks[i] + '</a></li>');
    }

    //Add IDs to content areas which correspond to tab link classes
    var count = 0;
    $tabContent.each(function() {
        $(this).attr('data-tabs-content', 'js-tab-' + count++);
    });

    $tabbedContentWrap.children('ul.js-tabs__list').children('li').children('a').each(function() {
        $(this).click(function() {
            var tabText = $(this).text();
            $(this).parent('li').siblings('li').removeClass('active');
            $(this).parent('li').addClass('active');
            var identifier = $(this).attr('data-tabs-target');
            $('.js-tabs__content').hide();
            $('div[data-tabs-content=' + identifier + ']').show();
            return false;
        });
    });

    $tabTitle.remove();
}
$(document).ready(tabbedContent);
/*
URL
*/
var Url = {
    
    getQueryVariable: function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i=0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return(false);
    }

};
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

/*
Form validation
*/

var Validation = {

    errorMsgSelector: {
        input: 'input-error'
    },

    init: function() {

        $('.is-success').remove();
        $('.is-error').remove();

        // var formIsValid = true;
        var form = $(this).parents('.js-validate');

        // Create the form object
        var formObj = {
            form: form,
            action: form.attr('action'),
            method: form.attr('method'),
            inputs: form.find('input, select, textarea'),
            isValid: true
        };

        formObj.inputs.each(function() {

            var inputObj = {
                    input: $(this),
                    id: $(this).attr('id'),
                    parentForm: $(this).parents('form'),
                    parentFieldset: $(this).parents('fieldset'),
                    submitBtn: $(this).parents('form').find('[type=submit]'),
                    label: $(this).siblings('label[for=' + $(this).attr('id') + ']'),
                    dataIsRequired: $(this).attr('data-val-isrequired'),
                    dataMatchAgainst: $(this).attr('data-val-matchagainst'),
                    dataMaxLength: parseInt($(this).attr('data-val-maxlength'), 10),
                    dataRegex: $(this).attr('data-val-regex'),
                    dataType: $(this).attr('data-val-type'),
                    value: $(this).val(),
                    errorMsg: {
                        empty: $(this).attr('data-val-error-empty'),
                        invalid: $(this).attr('data-val-error-invalid')
                    },
                    dataIsFutureDate: $(this).parent('fieldset').attr('data-val-isfuturedate')
            };
            
            // If the input is required and not disabled
            if (inputObj.dataIsRequired && !inputObj.input.prop('disabled')) {
                // Check it's not empty
                if (!Validation.requiredInputHasValue(inputObj.input)) {
                    // Render error message if empty
                    Validation.renderErrorMsg(inputObj.input, inputObj.errorMsg.empty, formObj);
                } else {
                    // Start validation
                    Validation.removeErrorMsg(inputObj.input, formObj); // Clear existing error msgs
                    Validation.validateInput(formObj, inputObj);
                }
            }

        });
        
        if (formObj.isValid === true) {
            return true;
        } else {
            return false;
        }

    },

    validateInput: function(formObj, inputObj) {

        // Validate regex
        if (inputObj.dataRegex) {
            if (!Validation.matchRegex(inputObj.value, inputObj.dataRegex)) {
                Validation.renderErrorMsg(inputObj.input, inputObj.errorMsg.invalid, formObj);
            } else {
                Validation.removeErrorMsg(inputObj.input, formObj);
                // Validation.renderSuccessMsg(inputObj.input, formObj);
            }
        }
        // Validate matching fields
        if (inputObj.dataMatchAgainst) {
            if (!Validation.validateMatchingInputs(inputObj.input, $('#' + inputObj.dataMatchAgainst))) {
                Validation.renderErrorMsg(inputObj.input, inputObj.errorMsg.invalid, formObj);
            } else {
                Validation.removeErrorMsg(inputObj.input, formObj);
                // Validation.renderSuccessMsg(inputObj.input, formObj);
            }
        }
        // Validate required checkbox (e.g: Terms & Conditions)
        if (inputObj.dataType === 'requiredCheckbox') {
            if (!Validation.inputIsChecked(inputObj.input)) {
                Validation.renderErrorMsg(inputObj.input, inputObj.errorMsg.empty, formObj);
            } else {
                Validation.removeErrorMsg(inputObj.input, formObj);
                // Validation.renderSuccessMsg(inputObj.input, formObj);
            }
        }
        // Validate select
        if (inputObj.dataType.indexOf('requiredSelect') > -1) {
            if (!Validation.validateRequiredSelect(inputObj.input)) {
                Validation.renderErrorMsg(inputObj.input, inputObj.errorMsg.empty, formObj);
            } else {
                if (inputObj.dataType.indexOf('dob') > -1) {
                    Validation.validateDOB(inputObj, formObj);
                } else {
                    Validation.removeErrorMsg(inputObj.input, formObj);
                    // Validation.renderSuccessMsg(inputObj.input, formObj);
                }
            }
        }
        // Validate max length
        if (inputObj.dataMaxLength) {
            if (!Validation.validateMaxLength(inputObj.input, inputObj.dataMaxLength)) {
                Validation.renderErrorMsg(inputObj.input, inputObj.errorMsg.invalid, formObj);
            } else {
                Validation.removeErrorMsg(inputObj.input, formObj);
                // Validation.renderSuccessMsg(inputObj.input, formObj);
            }
        }
        // Validate required radio group
        if (inputObj.dataType === 'requiredRadio') {
            if (!Validation.validateRequiredRadioGroup(inputObj.input)) {
                Validation.renderErrorMsg(inputObj.input, inputObj.errorMsg.empty, formObj);
            } else {
                Validation.removeErrorMsg(inputObj.input, formObj);
                // Validation.renderSuccessMsg(inputObj.input, formObj);
            }
        }

    },

    /*
    Validation methods
    */
    requiredInputHasValue: function(input) {
        return input.val().length ? true : false;
    },

    matchRegex: function(value, regex) {
        return value.match(regex) ? true : false;
    },

    inputIsChecked: function(input) {
        return input.prop('checked') ? true : false;
    },

    validateRequiredSelect: function(input) {
        return input.val() !== 'null' ? true : false;
    },

    validateMatchingInputs: function(input, matchAgainst) {
        return input.val() === matchAgainst.val() ? true : false;
    },
    
    validateMatchingInputAgainstString: function(input, matchAgainst) {
        return input.val() === matchAgainst ? true : false;
    },

    validateMaxLength: function(input, maxLength) {
        return input.val().length <= maxLength ? true : false;
    },

    validateRequiredRadioGroup: function(input) {
        var radioGroupFieldset = input.closest('fieldset');
        return radioGroupFieldset.find('input:radio:checked').length > 0 ? true : false;
    },

    validateDOB: function(inputObj, formObj) {
        var dobFieldset = inputObj.input.parents('.select__group');
        var DOB = {
            day:    dobFieldset.find('[data-val-date=day]').val() !== 'null' ? parseInt(dobFieldset.find('[data-val-date=day]').val(), 10) : null,
            month:  dobFieldset.find('[data-val-date=month]').val() !== 'null' ? parseInt(dobFieldset.find('[data-val-date=month]').val(), 10) : null,
            year:   dobFieldset.find('[data-val-date=year]').val() !== 'null' ? parseInt(dobFieldset.find('[data-val-date=year]').val(), 10) : null
        };
        if (DOB.day !== null && DOB.month !== null && DOB.year !== null) {
            if (!Validation.validatePastDate(DOB) || Validation.isToday(DOB)) {
                dobFieldset.find('.status-msg--is-error').remove();
                Validation.renderErrorMsg(inputObj.input, inputObj.errorMsg.invalid, formObj);
            }
        }
    },

    validatePastDate: function(date) {
        var currentDate = new Date(),
            returnVal = false;
            currentDate.day = currentDate.getDate();
            currentDate.month = currentDate.getMonth() + 1;
            currentDate.year = currentDate.getFullYear();

        if (date.year < currentDate.year) {
            returnVal = true;
        }
        if (date.year === currentDate.year) {
            if (date.month < currentDate.month) {
                returnVal = true;
            }
            if (date.month === currentDate.month) {
                if (date.day < currentDate.day) {
                    returnVal = true;
                }
            }
        }
        return returnVal;
    },

    validateFutureDate: function(date) {
        var currentDate = new Date(),
            returnVal = false;
            currentDate.day = currentDate.getDate();
            currentDate.month = currentDate.getMonth() + 1;
            currentDate.year = currentDate.getFullYear();

        if (date.year > currentDate.year) {
            returnVal = true;
        }
        if (date.year === currentDate.year) {
            if (date.month > currentDate.month) {
                returnVal = true;
            }
            if (date.month === currentDate.month) {
                if (date.day > currentDate.day) {
                    returnVal = true;
                }
            }
        }
        return returnVal;
    },

    isToday: function(date) {
        var currentDate = new Date();
            currentDate.day = currentDate.getDate();
            currentDate.month = currentDate.getMonth() + 1;
            currentDate.year = currentDate.getFullYear();
        return (date.year === currentDate.year && date.month === currentDate.month && date.day === currentDate.day);
    },

    renderErrorMsg: function(input, errorMsgText, formObj) {
        var label = $('label[for=' + input.attr('id') + ']'),
            attachErrorTo = label,
            attachLocation = 'append';

        if (label.hasClass('hidden')) {
            attachLocation = 'after';
            attachErrorTo.siblings('.status-msg--is-error').attr('data-val-msg-for', input.attr('id'));
            if (input.children('option').length > 0) {
                attachLocation = 'append';
                attachErrorTo = input.parents('fieldset').eq(0).children('legend');
            }
        }

        Validation.removeErrorMsg(input, formObj);
        input.addClass(Validation.errorMsgSelector.input);
        StatusMessage.create('error', errorMsgText, attachErrorTo, attachLocation);
        attachErrorTo.find('.status-msg--is-error')
            .attr('data-val-msg-for', input.attr('id'))
            .attr('data-test-hook', 'validation-error--' + input.attr('data-test-hook'));
        formObj.isValid = false;
    },

    renderSuccessMsg: function(input, formObj) {
        var attachMsgTo = input.children('option').length > 0 ? input.parents('fieldset').eq(0).children('legend') : $('label[for=' + input.attr('id') + ']');
        StatusMessage.create('success', '<span class="fa fa-check"></span>', attachMsgTo, 'append');
    },

    removeErrorMsg: function(input, formObj) {
        $('[data-val-msg-for=' + input.attr('id') + ']').remove();
        input.removeClass(Validation.errorMsgSelector.input);
    },

    handleForm: function(formObj) {
        return false;
    }

};
$('.js-validate').find('[type=submit]').on('click', Validation.init);
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
/*
Main navigation
*/
var MainNav = {

    showNavAt: 768,

    init: function() {
        var mainNavObj = {
            nav: $('.main-nav'),
            toggle: $('.main-nav__toggle')
        };

        if (Window.getViewportWidth() >= MainNav.showNavAt)
            MainNav.showNav(mainNavObj);

        MainNav.eventListeners(mainNavObj);
    },

    eventListeners: function(mainNavObj) {
        MainNav.setState(mainNavObj); // On load

        Window.resize(function() {
            MainNav.setState(mainNavObj);
        });
    },

    setState: function(mainNavObj) {
        if (Window.getViewportWidth() >= MainNav.showNavAt) {
            mainNavObj.toggle.attr('tabindex', '-1');
            MainNav.showNav(mainNavObj);
        } else {
            mainNavObj.toggle.removeAttr('tabindex');
            MainNav.hideNav(mainNavObj);
        }
    },

    showNav: function(mainNavObj) {
        mainNavObj.nav.show();
    },

    hideNav: function(mainNavObj) {
        mainNavObj.nav.hide();
    },

};
$(document).ready(MainNav.init);