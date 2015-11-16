<?php
function renderMonthSelect($truncate = false) {
    $months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    $element = '';

    foreach ($months as &$item) {
        $value = array_search($item, $months) + 1;
        $text = $item;
        if ($truncate === true) {
            $text = substr($text, 0, 3);
        }
        $element .= '<option value="'.$value.'">'.$text.'</option>';
    }

    return $element;

}
?>