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