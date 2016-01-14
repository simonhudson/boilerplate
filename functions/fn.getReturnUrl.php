<?php
function getReturnUrl() {
    return (getQueryStringValue('returnUrl') === null || getQueryStringValue('returnUrl') === '' ? 'home' : getQueryStringValue('returnUrl'));
}
?>