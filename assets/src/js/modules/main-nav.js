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