<?php include('layout/precontent.layout.inc.php'); ?>

    <div class="grid__wrap">

        <div class="grid__span--full">
            <h1><?= (isset($pages->$currentPage->pageHeading) ? $pages->$currentPage->pageHeading : $pages->$currentPage->mainNavText); ?></h1>
        </div>

    </div>

    <div class="grid-example">

        <div class="grid__wrap">
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
            <div class="grid__span--1">1</div>
        </div>

        <div class="grid__wrap">
            <div class="grid__span--2">2</div>
            <div class="grid__span--2">2</div>
            <div class="grid__span--2">2</div>
            <div class="grid__span--2">2</div>
            <div class="grid__span--2">2</div>
            <div class="grid__span--2">2</div>
            <div class="grid__span--2">2</div>
            <div class="grid__span--2">2</div>
            <div class="grid__span--2">2</div>
        </div>

        <div class="grid__wrap">
            <div class="grid__span--3">3</div>
            <div class="grid__span--3">3</div>
            <div class="grid__span--3">3</div>
            <div class="grid__span--3">3</div>
            <div class="grid__span--3">3</div>
            <div class="grid__span--3">3</div>
        </div>

        <div class="grid__wrap">
            <div class="grid__span--quarter">quarter</div>
            <div class="grid__span--quarter">quarter</div>
            <div class="grid__span--quarter">quarter</div>
            <div class="grid__span--quarter">quarter</div>
        </div>

        <div class="grid__wrap">
            <div class="grid__span--6">6</div>
            <div class="grid__span--6">6</div>
            <div class="grid__span--6">6</div>
        </div>

        <div class="grid__wrap">
            <div class="grid__span--third">third</div>
            <div class="grid__span--third">third</div>
            <div class="grid__span--third">third</div>
        </div>

        <div class="grid__wrap">
            <div class="grid__span--9">9</div>
            <div class="grid__span--9">9</div>
        </div>

        <div class="grid__wrap">
            <div class="grid__span--half">half</div>
            <div class="grid__span--half">half</div>
        </div>

        <div class="grid__wrap">
            <div class="grid__span--18">18</div>
            <div class="grid__span--full">full</div>
        </div>

        <div class="grid__wrap">
            <div class="grid__span--12">12</div>
            <div class="grid__span--6">6</div>
        </div>

    </div>
</div>

<?php include('layout/postcontent.layout.inc.php'); ?>