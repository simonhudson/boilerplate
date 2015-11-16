<?php
function currentPage() {
    $currentPage = end(explode('/', currentUrl()));
    $currentPage = str_replace('.php', '', $currentPage);
    $currentPage = preg_replace('/\?.*/', '', $currentPage);
    if (empty($currentPage) || $currentPage === 'home') {
        $currentPage = 'home';
    }
    return $currentPage;
}
?>