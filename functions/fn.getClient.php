<?php
function getClient() {
    $client = getQueryStringValue('client');
    return $client;
}
?>