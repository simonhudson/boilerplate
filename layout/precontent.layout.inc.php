<?php
session_start();
include('config/site.config.inc.php');
include('config/pages.config.inc.php');
include('config/paths.config.inc.php');
include('config/forms.config.inc.php');
include('functions/functions.inc.php');

$currentPage = currentPage();

$currentPage = currentPage();
if (isset($_POST['login__returnUrl'])) {
    $returnUrl = $_POST['login__returnUrl'];
}

if (isLoggedIn() && $currentPage == 'login') {
    header('Location: '.$pages->home->url);
}
// if (!isset($_SESSION['isLoggedIn']) && $currentPage != 'login' && $currentPage != 'register') {
//     header('Location: '.$pages->login->url);
// }
if (isset($_POST['login__submit']) && $_POST['login__password'] === 'admin') {
    $_SESSION['isLoggedIn'] = true;
    header('Location: '.(isset($pages->$returnUrl->url) ? $pages->$returnUrl->url : $pages->home->url));
}

?>
<!doctype html>
<!--[if lt IE 9]>
    <html class="lt-ie9" lang="en">
<![endif]-->
<!--[if gte IE 9]><!-->
<html lang="en">
<!--<![endif]-->
<head>
<meta charset="utf-8"/>
<meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible" />
<meta content="width=device-width, initial-scale=1" name="viewport" />
<title><?= (isset($pages->$currentPage->pageTitle) ? $pages->$currentPage->pageTitle : $pages->$currentPage->mainNavText).$site->globalHeadingFragment; ?></title>
<link href="<?= $paths->libs; ?>font-awesome/css/font-awesome.min.css" rel="stylesheet" />
<link href="<?= $paths->css; ?>application.min.css" rel="stylesheet" />
</head>
<body id="page--<?= currentPage(); ?>">
    
    <nav class="access-nav">
        <ul>
            <li class="access-nav__item">
                <a class="access-nav__link" href="#main-content">Skip to main content</a>
            </li>
            <li class="access-nav__item">
                <a class="access-nav__link" href="#main-nav">Skip to main navigation</a>
            </li>
        </ul>
    </nav>

    <div class="js-modal__overlay js-modal__overlay--full-screen"></div>

    <noscript>
        <div class="status-msg status-msg--is-warning status-msg--is-box full-width center-content">
            <span class="fa fa-lg fa-exclamation-triangle margin-r-sm"></span>
            <span class="status-msg__title">Please enable JavaScript to use this site.</span>
        </div>
    </noscript>

    <header class="header--global <?php foreach($pages as $page): ?><?= ($page->url === $currentPage ? ' header--has-secondary-nav' : ''); ?><?php endforeach; ?>">
        <div class="grid__wrap">
            <div class="grid__span--4 logo">
                <p>
                    <a class="header--global__logo-link" href="<?= $pages->home->url; ?>">
                        <?= $site->name; ?>
                    </a>
                </p>   
            </div>
            <div class="grid__span--14 main-nav__wrap">
                <nav class="main-nav" data-showhide-content="sh-main-nav" id="main-nav">
                    <ul class="main-nav__list">
                        <?php foreach($pages as $page): ?>
                            <?php
                            $linkTestHook = str_replace('./', '', $page->url);
                            $linkTestHook = str_replace('.php', '', $linkTestHook);
                            if (!isset($page->omitFromNav)): ?>
                                <li class="main-nav__item">
                                    <a class="main-nav__link <?= ($page->url === $currentPage) ? ' current' : ''; ?>" data-test-hook="main-nav__<?= (empty($linkTestHook) ? 'home' : $linkTestHook); ?>" href="<?= $siteRoot.$page->url; ?>">
                                        <span class="main-nav__text"><?= $page->mainNavText; ?></span>
                                    </a>
                                    <?php if ($page->url === $currentPage && isset($page->secondaryNav)): ?>
                                    <nav class="secondary-nav">
                                        <?php include('includes/nav/'.$page->url.'.secondarynav.inc.php'); ?>
                                    </nav>
                                    <?php endif; ?>
                                </li>
                            <?php endif; ?>
                        <?php endforeach; ?>
                        <li class="main-nav__item">
                            <a class="main-nav__link <?= ($page->url === $currentPage) ? ' current' : ''; ?>" data-test-hook="main-nav__<?= (empty($linkTestHook) ? 'home' : $linkTestHook); ?>" href="<?= (isLoggedIn() ? $siteRoot.$pages->logout->url : $siteRoot.$pages->login->url); ?>?returnUrl=<?= $currentPage; ?>">
                                <span class="main-nav__text"><?= (isLoggedIn() ? $pages->logout->mainNavText : $pages->login->mainNavText); ?></span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <a class="main-nav__toggle js-showhide-toggle" data-showhide-target="sh-main-nav" href="#">
                <span class="fa fa-bars fa-2x"></span>
                <span class="main-nav-toggle__text">Menu</span>
            </a>
        </div>
    </header>

    <main id="main-content">