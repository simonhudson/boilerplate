<?php include('layout/precontent.layout.inc.php'); ?>

    <div class="grid__span--12">
        <h1><?= (isset($pages->$currentPage->pageHeading) ? $pages->$currentPage->pageHeading : $pages->$currentPage->mainNavText); ?></h1>
        <button data-ajax="get--employees">Get employees</button>
        <ul class="employees__list js-employees__list no-bullet">
        </ul>
    </div>

<?php include('layout/postcontent.layout.inc.php'); ?>