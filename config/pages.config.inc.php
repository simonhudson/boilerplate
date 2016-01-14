<?php

$siteRoot = './';

$pages = (object) array(
    'login' => (object) array(
        'url' => 'login',
        'mainNavText' => 'Log in',
        'pageTitle' => 'Log in',
        'omitFromNav' => true    
    ),
    'logout' => (object) array(
        'url' => 'logout',
        'mainNavText' => 'Log out',
        'pageTitle' => 'Log out',
        'omitFromNav' => true
    ),
    'home' => (object) array(
        'url' => $siteRoot,
        'mainNavText' => 'Home',
        'pageTitle' => 'Home',
        'omitFromNav' => true
    ),
    'news' => (object) array(
        'url' => 'news',
        'mainNavText' => 'News',
        'pageTitle' => 'News',
        'secondaryNav' => 'news'
    ),
    'fixtures-results' => (object) array(
        'url' => 'fixtures-results',
        'mainNavText' => 'Fixtures/Results',
        'pageTitle' => 'Fixtures &amp; Results',
        'secondaryNav' => 'fixtures-results'
    ),
    'tickets' => (object) array(
        'url' => 'tickets',
        'mainNavText' => 'Tickets',
        'pageTitle' => 'Tickets',
        'secondaryNav' => 'tickets'
    ),
    'team' => (object) array(
        'url' => 'team',
        'mainNavText' => 'Team',
        'pageTitle' => 'Team',
        'secondaryNav' => 'team'
    ),
    'stats' => (object) array(
        'url' => 'stats',
        'mainNavText' => 'Stats',
        'pageTitle' => 'Stats',
        'secondaryNav' => 'stats'
    ),
    'fans' => (object) array(
        'url' => 'fans',
        'mainNavText' => 'Fans',
        'pageTitle' => 'Fans',
        'secondaryNav' => 'fans'
    ),
    'club' => (object) array(
        'url' => 'club',
        'mainNavText' => 'Club',
        'pageTitle' => 'Club',
        'secondaryNav' => 'club'
    ),
    'commercial' => (object) array(
        'url' => 'commercial',
        'mainNavText' => 'Commercial',
        'pageTitle' => 'Commercial',
        'secondaryNav' => 'commercial'
    ),
    'grid' => (object) array(
        'url' => 'grid',
        'mainNavText' => 'Grid',
        'pageTitle' => 'Grid',
        'omitFromNav' => true
    ),
    'register' => (object) array(
        'url' => 'register',
        'mainNavText' => 'Register',
        'pageTitle' => 'Register',
        'omitFromNav' => true
    )

);


?>