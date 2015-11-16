/********************
    Set up
********************/
var casper = require('casper').create();
phantom.casperTest = true;

var indentSpacing = '    ',
    env,
    config,
    successCount = [],
    failureCount = [];

    // If we've not defined an environment option, default to 'dev'
    env !== undefined ? env = casper.cli.get('env') : env = 'dev';

    config = setConfig(casper, env);

// Set the config file
function setConfig(casper, env) {
    var fs = require('fs');
    
    var envConfig = 'test-' + env + '.json',
        envConfig = fs.open(envConfig, { mode: 'r' }),
        envConfig = JSON.parse(envConfig.read());

    var config = fs.open(envConfig.configFile, { mode: 'r' }),
        config = JSON.parse(config.read());
    
    config.host = envConfig.host;

    return config;
}

/********************
    Run the tests
********************/
casper.test.on('success', function(success) {
    successCount.push(success);
});
casper.test.on('fail', function(failure) {
    failureCount.push(failure);
    // On failure, bail out of tests and display summary
    displayTestSummary(casper);
});

casper.start(config.host).waitForUrl(config.host, function() {
    casper.echo(
        '\n\n**************************************\n*\n' +
        '* Accessibility Testing\n*\n' +
        '* URL:' + indentSpacing + casper.getCurrentUrl() +'\n*\n' +
        '**************************************'
    );
    casper.then(function() {
        createPageObj(casper, config);
    });
});

// Create the page object so we can pass it around the tests
function createPageObj(casper, config) {
    for (var page in config.pages) {
        var pageObj = {};
            pageObj.outOfSession = config.pages[page].outOfSession;
            pageObj.omitTests = config.pages[page].omitTests;
            pageObj.path = config.host + config.pages[page].path;
            pageObj.pageTitle = config.pages[page].pageTitle;
            pageObj.pageHeading = config.pages[page].pageHeading;
            pageObj.desktopTests = config.pages[page].desktopTests;
            pageObj.tabletTests = config.pages[page].tabletTests;
            pageObj.mobileTests = config.pages[page].mobileTests;

        if (!pageObj.omitTests) {
            runTests(casper, config, pageObj);
        }

    }
    casper.then(function() {
        displayTestSummary(casper);
    });
}

// Run the tests
function runTests(casper, config, pageObj) {
    casper.thenOpen(pageObj.path, function() {
        casper.waitForUrl(pageObj.path, function() {
            waitForJSToLoad(casper, function () {
                casper.echo(
                    '\n----------------------------------------\n\n' +
                    casper.getCurrentUrl() +
                    '\n\n----------------------------------------'
                );
                basicPageCheck(casper, config, pageObj);

                // Run desktop tests
                casper.then(function() {
                    if (pageObj.desktopTests.length) {
                        setViewPort(casper, 1920, 1080);
                        for (var i=0; i < pageObj.desktopTests.length; i++) {
                            window[pageObj.desktopTests[i]](casper, config, pageObj);
                        }
                    }
                });

                // Run tablet tests
                casper.then(function() {
                    if (pageObj.tabletTests.length) {
                        setViewPort(casper, 1024, 768);
                        for (var i=0; i < pageObj.tabletTests.length; i++) {
                            window[pageObj.tabletTests[i]](casper, config, pageObj);
                        }
                    }
                });

                // Run mobile tests
                casper.then(function() {
                    if (pageObj.mobileTests.length) {
                        setViewPort(casper, 360, 640);
                        for (var i=0; i < pageObj.mobileTests.length; i++) {
                            window[pageObj.mobileTests[i]](casper, config, pageObj);
                        }
                    }
                });

            });
        });
    });
}

/*
_____________________________________________________________________________________________________________________________
Casper functions
_____________________________________________________________________________________________________________________________
*/

// Wait for JS to load
function waitForJSToLoad(casper, callback) {
    var timeToLoadJSBehaviour = 2000;
    casper.wait(timeToLoadJSBehaviour, function () {
        callback();
    });
}

// Set viewport
function setViewPort(casper, widthPx, heightPx) {
    casper.echo('\n***\n*\n* Setting viewport: ' + widthPx + '(w) x ' + heightPx + '(h)\n*\n***');
    casper.options.viewportSize = { width: widthPx, height: widthPx };
}

// Echo test name
function echoTestName(casper, testName) {
    casper.echo('\nTEST: ' + testName + '\n-----');
}

/*
_____________________________________________________________________________________________________________________________
Utility tests
_____________________________________________________________________________________________________________________________
*/

// Check HTTP status
function checkHttpStatus(casper, url, expectedStatus) {
    casper.test.assertHttpStatus(expectedStatus);
}

// Check element for string fragment
function checkElementForString(casper, config, element, string) {
    var actualString = casper.fetchText(element),
        pattern = new RegExp(pattern);
    casper.test.assertMatch(
        actualString,
        pattern,
        '<' + element + '> has expected fragment ("' + actualString + '")'
    );
}
function getElementAttribute(casper, config, element, attr) {
    return casper.getElementAttribute(element, attr);
}
function getAllElements(casper, element) {

    // var elements;
    // casper.then(function() {
    //     casper.echo(element);
    //     casper.evaluate(function(element) {
    //         elements = [];
    //         var nodes = document.getElementsByTagName(element);
    //         for (var i=0; i < nodes.length; i++) {
    //             elements.push(nodes[i]);
    //         }
    //     }, element );
    // });
    // return elements;

    // casper.echo(element);
    // var elements = [];

    // casper.then(function() {

    //     elements = casper.evaluate(function () {
    //         var nodes = document.getElementsByTagName(element);
    //         for (var i=0; i < nodes.length; i++) {
    //             elements.push(nodes[i]);
    //         }
    //         // return [].map.call(nodes, function(node) {
    //         //     return node;
    //         // });
    //     });

    //     casper.then(function() {
    //         casper.echo(elements.length);
    //     });

    // });
    
    // return elements;
}
// function getAllLinks(casper) {
//     var links = [];

//     casper.then(function() {

//         links = casper.evaluate(function () {
//             var nodes = document.getElementsByTagName('a');
//             return [].map.call(nodes, function(node) {
//                 return node;
//             });
//         });

//     });
//     return links;
// }

/*
_____________________________________________________________________________________________________________________________
Global tests
_____________________________________________________________________________________________________________________________
*/

/*
/*
    TODO
        * forms
            * inputs have associated labels
            * fieldsets have legends
        * Links
            * click here in link phrases (get all link phrases and sniff for dodgy text - click here, here, click etc)
            * Same link phrases -> same url
        * tables
            * has caption
            * has th
                * th has unique ID
            * td has headers attr
*/

// Wrapper function for basic page checks
function basicPageCheck(casper, config, pageObj) {
    echoTestName(casper, 'Basic page check');
    checkHttpStatus(casper, pageObj.path, 200);
    accessibility(casper, config, pageObj);
}

// Wrapper function for accessibility checks
function accessibility(casper, config, pageObj) {
    echoTestName(casper, 'Accessibility tests');
    pageTitle(casper, config, pageObj);
    htmlLangAttr(casper, config, pageObj);
    checkH1(casper, config, pageObj);
    checkLinkText(casper, config, pageObj);
}

function pageTitle(casper, config, pageObj) {
    casper.test.assertTitle(pageObj.pageTitle + config.globalPageTitleFragment);
}

function htmlLangAttr(casper, config, pageObj) {
    var validValues = ['ab','aa','af','sq','am','ar','an','hy','as','ay','az','ba','eu','bn','dz','bh','bi','br','bg','my','be','km','ca','zh','zh-Hans','zh-Hant','co','hr','cs','da','nl','en','eo','et','fo','fa','fj','fi','fr','fy','gl','gd','gv','ka','de','el','kl','gn','gu','ht','ha','he','iw','hi','hu','is','io','id','in','ia','ie','iu','ik','ga','it','ja','jv','kn','ks','kk','rw','ky','rn','ko','ku','lo','la','lv','li','ln','lt','mk','mg','ms','ml','mt','mi','mr','mo','mn','na','ne','no','oc','or','om','ps','pl','pt','pa','qu','rm','ro','ru','sm','sg','sa','sr','sh','st','tn','sn','ii','sd','si','ss','sk','sl','so','es','su','sw','sv','tl','tg','ta','tt','te','th','bo','ti','to','ts','tr','tk','tw','ug','uk','ur','uz','vi','vo','wa','cy','wo','xh','yi','ji','yo','zu'],
        actualValue = getElementAttribute(casper, config, 'html', 'lang');
    casper.test.assert(validValues.indexOf(actualValue) > -1, '<html> has a valid lang attribute ("' + actualValue + '")');
}

function checkH1(casper, config, pageObj) {
    casper.test.assertExists('h1', 'Page has <h1> ("' + casper.fetchText('h1') + '")');
    casper.test.assertElementCount('h1', 1, 'Only 1 <h1> found');
}
function checkLinkText(casper, config, pageObj) {

    // var links = getAllElements(casper, 'a');
    // casper.echo(links.length);
    // var links = getAllElements(casper, 'a', function() {
    //         casper.echo(links.length);

    // });

    // getAllLinks(casper, function(links) {
    //     casper.each(links, function() {
    //         casper.echo(0);
    //     });
    // });

    // getAllLinks(casper, config, function(links) {

    //     var blacklist = ['Click here'],
    //         linkTextIsGood = true,
    //         flaggedLinkText = [];

    //     casper.each(links, function(self, link) {
    //         // casper.echo(link.textContent);
    //         casper.evaluate(function(linkText, blacklist) {
    //             casper.echo(blacklist.length);
    //             // if (blacklist.indexOf(linkText) > -1)
    //             //     var linkTextIsGood = false;
    //         }, 'click here', blacklist);
    //     });
    //     // casper.then(function() {
    //     //     casper.echo(linkTextIsGood);
    //     // });



    //     // casper.evaluate(function() {
    //         // for (var i=0; i < links.length; i++) {
    //         //     casper.echo(9);
    //         // }
    //     // });

    // });
    //     // blacklist = ['click here'],
    //     // linkTextIsGood = true;

    //     // for (var i=0; i < links.length; i++) {
    //     //     casper.echo(links[i]);
    //     // }

    //     // casper.echo(links[0].getAttribute('href'));

    //     // for (var item in links) {
    //     //     casper.echo(item.getAttribute('href'));
    //     // }

    //     // for (var i=0; i < links.length; i++) {
    //     //     casper.evaluate(function() {
    //     //         casper.echo(links[i].getAttribute('href'));
    //     //     });
    //     // }

    // // casper.each(links, function(self, link) {
    // //     var linkText = self.evaluate(function() {
    // //         link.fetchText.trim();
    // //     });
    // //     self.echo(linkText);
    // //     // for (var i=0; i < blacklist.length; i++) {
    // //     //     if (linkText.toLowerCase().indexOf(blacklist[i].toLowerCase()) > -1) {
    // //     //         linkTextIsGood = false;
    // //     //         self.test.fail('Possible use of poor link phrase ("' + link + '")');
    // //     //     }
    // //     // }
    // // });
    // // if (linkTextIsGood === true)
    // //     casper.test.pass('No suspicious link text found. Manual confirmation recommended.');
}

/********************
    End of tests
********************/

// Display summary
function displayTestSummary(casper) {

    var totalTests = successCount.length + failureCount.length,
        successPercentage = Math.round((successCount.length / totalTests) * 100),
        failurePercentage = Math.round((failureCount.length / totalTests) * 100);

    casper.echo(
        '\n\n****************************************************************************\n*\n' +
        '*  TESTS COMPLETED\n*\n' +
        '*  Total tests:  ' + totalTests + '\n*\n' +
        '*  Passed:       ' + successCount.length + ' (' + successPercentage + '%)\n' +
        '*  Failed:       ' + failureCount.length + ' (' + failurePercentage + '%)\n*\n' +
        '****************************************************************************\n'
    );

    casper.exit();
}

casper.run();