/********************
    Set up
********************/
var casper = require('casper').create();
var colorizer = require('colorizer').create('Colorizer');
phantom.casperTest = true;

var indentSpacing = '    ',
    summaryLinePrefix = '*  ',
    env,
    type = 'all',
    config,
    successCount = [],
    failureCount = [],
    warnings = {},
    newWarningIndex = 0;

    // If we've not defined an environment option, default to 'dev'
    env !== undefined ? env = casper.cli.get('env') : env = 'dev';
    if (casper.cli.get('type') !== undefined)
        type = casper.cli.get('type');

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
        summaryLinePrefix + 'Testing: ' + casper.getCurrentUrl() +'\n*\n' +
        '**************************************', 'INFO'
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
    casper.echo('\n' + testName + '\n-----');
}

// Re-write casper.warn() as the output was wrong in cmd line
function echoWarning(casper, msg) {
    newWarningIndex = Object.keys(warnings).length + 1;
    var prop = 'warning' + newWarningIndex;
    casper.echo('WARN ' + msg);
    warnings[prop] = {
        url: casper.getCurrentUrl(),
        msg: msg
    };
}
/*
_____________________________________________________________________________________________________________________________
Utility functions
_____________________________________________________________________________________________________________________________
*/

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

function getElements(tagName) {
    casper.then(function() {

        tagName = tagName ? tagName.toString() : '*';
        elements = casper.evaluate(function(tagName) {

            var elements = document.querySelectorAll(tagName);
            elements = Array.prototype.map.call(elements, function(element) {

                var elementObj = {
                    alt:            typeof element.getAttribute('alt') === 'object' ? undefined : element.getAttribute('alt'),
                    class:          typeof element.getAttribute('class') === 'object' ? undefined : element.getAttribute('class'),
                    elementName:    element.nodeName.toLowerCase(),
                    for:            typeof element.getAttribute('for') === 'object' ? undefined : element.getAttribute('for'),
                    href:           typeof element.getAttribute('href') === 'object' ? undefined : element.getAttribute('href'),
                    id:             typeof element.getAttribute('id') === 'object' ? undefined : element.getAttribute('id'),
                    innerHTML:      element.innerHTML,
                    src:            typeof element.getAttribute('src') === 'object' ? undefined : element.getAttribute('src'),
                    this:           element,
                    tabindex:       typeof element.getAttribute('tabindex') === 'object' ? undefined : element.getAttribute('tabindex'),
                    target:         typeof element.getAttribute('target') === 'object' ? undefined : element.getAttribute('target'),
                    text:           element.textContent,
                    type:           typeof element.getAttribute('type') === 'object' ? undefined : element.getAttribute('type')
                };

                return elementObj;
            });
            return elements;
        }, tagName);
    });
}

/*
_____________________________________________________________________________________________________________________________
Global tests
_____________________________________________________________________________________________________________________________
*/

// Wrapper function for basic page tests
function basicPageCheck(casper, config, pageObj) {
    echoTestName(casper, 'Basic page check');
    checkHttpStatus(casper, pageObj.path, 200);
    accessibility(casper, config, pageObj);
    // functional(casper, config, pageObj);
}

/*
_____________________________________________________________________________________________________________________________
Accessibility tests

TODO
    * Forms
        * Legend
        * Input has ID
        * Input has associated label

    * img
        * img has alt (manual confirmation if empty)

    * table
        * caption
        * th has id
        * td has headers
_____________________________________________________________________________________________________________________________
*/

// Wrapper function for accessibility tests
function accessibility(casper, config, pageObj) {
    if (type === 'accessibility' || type === 'all') {
        echoTestName(casper, 'Accessibility tests');
        pageTitle(casper, config, pageObj);
        htmlLangAttr(casper, config, pageObj);
        accessLinks(casper, config, pageObj);
        checkH1(casper, config, pageObj);
        checkHeadingStructure(casper, config, pageObj);
        checkLinkText(casper, config, pageObj);
        checkNewWindowWarning(casper, config, pageObj);
        checkForm(casper, config, pageObj);
        checkImgAlt(casper, config, pageObj);
        checkButtonForText(casper, config, pageObj);
    }
}

function pageTitle(casper, config, pageObj) {
    casper.test.assertTitle(pageObj.pageTitle + config.globalPageTitleFragment);
}

function htmlLangAttr(casper, config, pageObj) {
    var validValues = ['ab','aa','af','sq','am','ar','an','hy','as','ay','az','ba','eu','bn','dz','bh','bi','br','bg','my','be','km','ca','zh','zh-Hans','zh-Hant','co','hr','cs','da','nl','en','eo','et','fo','fa','fj','fi','fr','fy','gl','gd','gv','ka','de','el','kl','gn','gu','ht','ha','he','iw','hi','hu','is','io','id','in','ia','ie','iu','ik','ga','it','ja','jv','kn','ks','kk','rw','ky','rn','ko','ku','lo','la','lv','li','ln','lt','mk','mg','ms','ml','mt','mi','mr','mo','mn','na','ne','no','oc','or','om','ps','pl','pt','pa','qu','rm','ro','ru','sm','sg','sa','sr','sh','st','tn','sn','ii','sd','si','ss','sk','sl','so','es','su','sw','sv','tl','tg','ta','tt','te','th','bo','ti','to','ts','tr','tk','tw','ug','uk','ur','uz','vi','vo','wa','cy','wo','xh','yi','ji','yo','zu'],
        actualValue = getElementAttribute(casper, config, 'html', 'lang');
    casper.test.assert(validValues.indexOf(actualValue) > -1, '<html> has a valid lang attribute ("' + actualValue + '")');
}

function accessLinks(casper, config, pageObj) {
    var accessNavSelector = '.access-nav';
    getElements(accessNavSelector + ' a');
    casper.then(function() {
        casper.test.assertExists(accessNavSelector);
        casper.each(elements, function(self, elementObj) {
            casper.test.assertExists(elementObj.href, 'Found access link to ' + elementObj.href + '. Element with ID "' + elementObj.href.replace('#', '') + '" found.');
        });
    });
}

function checkH1(casper, config, pageObj) {
    casper.test.assertElementCount('h1', 1, 'Only 1 <h1> found');
    casper.test.assertExists('h1', 'Page has <h1> ("' + casper.fetchText('h1') + '")');
}

function checkHeadingStructure(casper, config, pageObj) {

    var headings = ['h1','h2','h3','h4','h5','h6'],
        pageHeadings = [],
        headingStructureIsGood = true,
        currentHeadingLevel,
        prevHeadingLevel,
        nextHeadingLevel;

    getElements();
    casper.then(function() {
        casper.each(elements, function(self, elementObj) {
            if (headings.indexOf(elementObj.elementName) > -1)
                pageHeadings.push(elementObj.elementName);
        });
        for (var i=0; i < pageHeadings.length; i++) {
            
            currentHeadingLevel = parseInt(pageHeadings[i].slice(-1), 10);

            if (pageHeadings[i + 1] !== undefined) {
                nextHeadingLevel = parseInt(pageHeadings[i + 1].slice(-1), 10);
                if (nextHeadingLevel !== (currentHeadingLevel + 1) && nextHeadingLevel !== currentHeadingLevel && nextHeadingLevel !== (currentHeadingLevel - 1)) {
                    casper.test.fail('Bad heading structure. <h' + currentHeadingLevel + '> followed by <h' + nextHeadingLevel + '>');
                    headingStructureIsGood = false;
                }
            }
            
        }
        if (headingStructureIsGood === true)
            casper.test.pass('Heading structure appears good.');
    });
}

function checkLinkText(casper, config, pageObj) {

    var blacklist = ['more', 'link', 'click', 'here', 'click here', 'read more'],
        linkTextIsGood = true,
        feedback;

    getElements('a, button');
    casper.then(function() {
        casper.each(elements, function(self, elementObj) {
            for (var i=0; i < blacklist.length; i++) {
                var elementText = elementObj.text.toLowerCase();
                if (blacklist[i].toLowerCase().indexOf(elementText) > -1) {
                    feedback = 'Possible poor link text ("' + elementObj.text + '" on <' + elementObj.elementName + '>)';
                    linkTextIsGood = false;
                    echoWarning(casper, feedback);
                } else {
                    feedback = 'No suspicious link text found. Manual confirmation recommended.';
                }
            }
        });
        if (linkTextIsGood === true) {
            casper.test.pass(feedback);
        }
    });
}

function checkNewWindowWarning(casper, config, pageObj) {

    var warningText = 'new window';

    getElements('a');

    casper.then(function() {
        casper.each(elements, function(self, elementObj) {
            if (elementObj.target !== undefined) {
                if (elementObj.text.indexOf(warningText) > -1) {
                    casper.test.pass('New window link contains warning ("' + elementObj.text + '", ' + elementObj.href + ')');
                } else {
                   casper.test.fail('New window link does not contain warning ("' + elementObj.text + '", ' + elementObj.href + ')');
                }
            }
        });
    });
}

function checkForm(casper, config, pageObj) {

    function checkFormHasSubmit() {
        getElements('form');
        casper.then(function() {
            casper.each(elements, function(self, elementObj) {
                casper.test.assertExists('#' + elementObj.id + ' > input[type=submit]', '<' + elementObj.elementName + ' id="' + elementObj.id + '"> has submit <input>');
            });
        });
    }
    checkFormHasSubmit();

    // function checkFieldsetHasLegend() {
    //     getElements('fieldset');
    //     casper.then(function() {
    //         casper.each(elements, function(self, elementObj) {
    //             casper.test.assertExists(elementObj.elementName + ' > legend', '<fieldset> has a <legend>');
    //         });
    //     });
    // }
    // checkFieldsetHasLegend();

    function checkInputHasId() {
        getElements('input, select');
        casper.then(function() {
            casper.each(elements, function(self, elementObj) {
                if (elementObj.type !== 'submit') {
                    if (elementObj.id) {
                        casper.test.pass('<' + elementObj.elementName + '> has "id" attr ("' + elementObj.id + '")');
                        checkInputHasLabel(elementObj.id);
                        checkForTabIndex(elementObj);
                    } else {
                        casper.test.fail('<input> does not have "id" attr.');
                    }
                }
            });
        });
    }
    checkInputHasId();

    function checkInputHasLabel(inputId) {
        casper.test.assertExists('label[for=' + inputId + ']', '<label for="' + inputId + '"> exists');
    }

    function checkForTabIndex(elementObj) {
        if (elementObj.tabindex !== undefined)
            echoWarning(casper, '<' + elementObj.elementName + '> #' + elementObj.id + ' has a "tabindex" attr.');
    }
    
}

function checkButtonForText(casper, config, pageObj) {
    getElements('button');
    casper.then(function() {
        casper.each(elements, function(self, elementObj) {
            var buttonHasText = elementObj.text.length > 0;
            if (buttonHasText) {
                casper.test.pass('<button> has text ("' + elementObj.text + '")');
            } else {
                casper.test.fail('<button> has no text (' + elementObj.innerHTML + ')');
            }
        });
    });
}

function checkImgAlt(casper, config, pageObj) {
    getElements('img');
    casper.then(function() {
        casper.each(elements, function(self, elementObj) {
            if (elementObj.alt !== undefined) {
                if (elementObj.alt.trim()) {
                    echoWarning(casper, '<img> ("' + elementObj.src.split('/').pop() + '") has "alt" attr ("' + elementObj.alt + '"). If <img> is purely decorative, consider replacing with alt="".');
                } else {
                    echoWarning(casper, '<img> ("' + elementObj.src.split('/').pop() + '") has empty "alt" attr. Is this <img> purely decorative?');
                }
            } else {
                casper.test.fail('<img> ("' + elementObj.src.split('/').pop() + ')" has no "alt" attr. If <img> is decorative, use alt="", otherwise, add a descriptive "alt" attribute.');
            }
        });
    });
}

/*
_____________________________________________________________________________________________________________________________
Functional tests
_____________________________________________________________________________________________________________________________
*/

// Wrapper function for functional tests
function functional(casper, config, pageObj) {
    if (type === 'functional' || type === 'all') {
        echoTestName(casper, 'Functional tests');
    }
}



/********************
    End of tests
********************/

// Display summary
function displayTestSummary(casper) {

    var totalTests = successCount.length + failureCount.length,
        successPercentage = Math.round((successCount.length / totalTests) * 100),
        failurePercentage = Math.round((failureCount.length / totalTests) * 100),
        warningList = '';

    for (var item in warnings) {
        warningList += summaryLinePrefix + warnings[item].url + '\n' + summaryLinePrefix + warnings[item].msg + '\n*\n';
    }

    casper.echo(
        '\n\n****************************************************************************\n*\n' +
        summaryLinePrefix + 'TESTS COMPLETED\n*\n' +
        summaryLinePrefix + 'Total tests:  ' + totalTests + '\n*\n' +
        summaryLinePrefix + 'Passed:       ' + successCount.length + ' (' + successPercentage + '%)\n' +
        summaryLinePrefix + 'Failed:       ' + failureCount.length + ' (' + failurePercentage + '%)\n*\n*\n' +
        summaryLinePrefix + 'Warnings:     ' + newWarningIndex + '\n' +
        summaryLinePrefix + '---------\n' +
        warningList +
        '****************************************************************************\n'
    );

    casper.exit();
}

casper.run();