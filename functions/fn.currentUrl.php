<?php
function currentUrl() {
    $currentUrl = 'http://';
    if ($_SERVER['SERVER_PORT'] != '80') {
        $currentUrl .= $_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$_SERVER['REQUEST_URI'];
    } else {
        $currentUrl .= $_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
    }
    return $currentUrl;
}
?>