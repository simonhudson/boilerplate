<?php
function truncateValue($value) {

    $subStr = null;
    $appendLetter = null;
    $decimal = null;

    // Truncate thousands
    if ($value > 9999 && $value < 1000000) {
        $subStr = -3;
        $decimal = substr($value, 2, 1);
        $appendLetter = 'K';
    }

    // Truncate millions
    if ($value > 999999) {
        $subStr = -6;
        $decimal = $value[2];
        $appendLetter = 'M';
    }

    return $value = substr($value, 0 , $subStr).'.'.$decimal.$appendLetter;
}
?>