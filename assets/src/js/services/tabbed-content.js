function tabbedContent() {

    var
        $tabbedContentWrap = $('.js-tabs__wrap'),
        $tabContent = $('.js-tabs__content'),
        $tabTitle = $('.js-tabs__title')
    ;

    $('.js-tabs__title, .js-tabs__content').hide();
    $tabContent.eq(0).show();

    //Add class for JS specific styling
    $tabbedContentWrap.addClass('js-on');

    //Create tab links
    $tabbedContentWrap.prepend('<ul class="js-tabs__list"></ul>');
    var tabLinks = [];
    $tabTitle.each(function() {
        tabLinks.push($(this).text());
    });
    var count = 0;
    for (i = 0; i < tabLinks.length; i++) {
        $tabbedContentWrap.children('ul.js-tabs__list').append('<li class="js-tabs__item"><a href="#" class="js-tabs__link" data-tabs-target="js-tab-' + count++ + '">' + tabLinks[i] + '</a></li>');
    }

    //Add IDs to content areas which correspond to tab link classes
    var count = 0;
    $tabContent.each(function() {
        $(this).attr('data-tabs-content', 'js-tab-' + count++);
    });

    $tabbedContentWrap.children('ul.js-tabs__list').children('li').children('a').each(function() {
        $(this).click(function() {
            var tabText = $(this).text();
            $(this).parent('li').siblings('li').removeClass('active');
            $(this).parent('li').addClass('active');
            var identifier = $(this).attr('data-tabs-target');
            $('.js-tabs__content').hide();
            $('div[data-tabs-content=' + identifier + ']').show();
            return false;
        });
    });

    $tabTitle.remove();
}
$(document).ready(tabbedContent);