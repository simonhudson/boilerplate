<?php
function getQueryStringValue($query) {
    $value = isset($_GET[$query]) ? $_GET[$query] : null;
    return $value;
}
?>