/*
Generic error */
var GenericError = {
  
    show: function(attachTo) {
        attachTo = attachTo ? attachTo : $('body');
        StatusMessage.create('error', 'An error occurred, please try again.', attachTo, 'prepend', true, true);
    }

};