<?php
function pageHeading() {
    include('config/pages.config.inc.php');
    $currentPage = currentPage();
    // return $currentPage;
    return (isset($pages->$currentPage->pageTitle) ? $pages->$currentPage->pageTitle : $pages->$currentPage->mainNavText);
}
?>