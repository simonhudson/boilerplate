<?php
function renderNumberSelect($end, $start = 1, $isDesc = false) {
    $element = '';
    if ($isDesc === true) {
        $i = $end;
        while ($i >= $start) {
            $element .= '<option value="'.$i.'">'.$i.'</option>';
            $i--; 
        }
    } else {
        $i = $start;
        while ($i <= $end) {
            $element .= '<option value="'.$i.'">'.$i.'</option>';
            $i++; 
        }
    }
    return $element;
}
?>