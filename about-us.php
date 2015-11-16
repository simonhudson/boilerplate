<?php include('layout/precontent.layout.inc.php'); ?>

    <div class="grid__wrap">
        <div class="grid__span--4">
            <?php include('includes/nav/'.$pages->$currentPage->secondaryNav.'.secondarynav.inc.php'); ?>
        </div>
        <div class="grid__span--14">
            <h1><?= (isset($pages->$currentPage->pageHeading) ? $pages->$currentPage->pageHeading : $pages->$currentPage->mainNavText); ?></h1>
            <p><a class="js-showhide-toggle" data-showhide-target="more-content" href="#"><span class="fa fa-chevron-down"></span>Show more content</a></p>
            <div class="padding-b" data-showhide-content="more-content">
                <p>The proof is in the pudding, and the pudding, in this case, is a football... Boof! Eat my goal!! The goalie has got football pie all over his shirt!</p>
                <p>And, can I have the same, please? But with different shaped pasta. What do you call those pasta in bows? Like a bow-tie, but miniature? Like an action man bow-tie.</p>
                <p>On making a documentary for canal boats: ‘This chemical toilet is a Saniflow 33, now this little babe can cope with anything, and I mean anything. Earlier on I put in a pound of mashed up Dundee cake, let's take a look...not a trace! Peace of mind I'm sure, especially if you have elderly relatives on board.’</p>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus <a href="http://www.cnn.com" target="_blank">tincidunt sem ac<span class="hidden"> (opens new window)</span></a> justo fringilla, quis sagittis risus mollis. Nunc non malesuada nulla, sed feugiat felis. Vivamus tristique ullamcorper quam at gravida. In hac habitasse platea dictumst. Morbi elementum elit tortor, vitae molestie ligula posuere et. Fusce eget interdum magna. Fusce consequat tincidunt turpis. Nulla gravida justo vel nulla condimentum lacinia. Ut in imperdiet tellus, at ullamcorper nunc. Nam non dictum erat.</p>
            <p>Nam varius mattis ornare. Sed eget maximus nunc. Maecenas maximus sapien sit amet massa aliquam commodo. Etiam congue leo est, in accumsan lacus malesuada sit amet. Ut congue tempor ante, et condimentum nisl imperdiet nec. Nullam eu pretium est, quis lacinia nunc. Phasellus rhoncus placerat magna vel suscipit. Pellentesque non pharetra velit. Etiam maximus a ante vitae faucibus. Fusce ornare condimentum risus. Aenean convallis mi ac felis tincidunt egestas.</p>
            <p>Aliquam placerat nunc in nunc tempor blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse ac lorem vitae neque porttitor volutpat. Praesent venenatis efficitur turpis, et facilisis arcu venenatis sit amet. Donec ut erat tempor, mollis ex eget, lobortis lorem. Sed congue, eros sed maximus pretium, purus metus eleifend libero, a iaculis libero eros a nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla varius, urna vel tristique luctus, felis felis cursus eros, sit amet mollis purus ante non dui. Fusce id nibh vitae tellus faucibus laoreet et at dui. Ut id vestibulum orci. Nulla ac tellus massa. Nam ullamcorper consequat risus, id blandit augue condimentum et.</p>
        </div>

    </div>

<?php include('layout/postcontent.layout.inc.php'); ?>