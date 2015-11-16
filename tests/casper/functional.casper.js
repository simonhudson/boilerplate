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
	env !== undefined 
		? env = casper.cli.get('env') 
		: env = 'dev';

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
		'* Functional Testing\n*\n' +
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

// Check hidden area is revealed on element click
function checkHiddenAreaIsRevealed(casper, elementToClick, hiddenArea) {
	casper.test.assertNotVisible(hiddenArea, '\'' + hiddenArea + '\' is not visible');
	casper.echo(indentSpacing + 'THEN \'' + elementToClick + '\' is clicked');
	casper.click(elementToClick);
	casper.waitUntilVisible(hiddenArea, function success() {
		casper.test.assertVisible(hiddenArea, '\'' + hiddenArea + '\' became visible');
	});
}

// Check visible area is hidden on element click
function checkVisibleAreaIsHidden(casper, elementToClick, visibleArea) {
	casper.test.assertVisible(visibleArea, '\'' + visibleArea + '\' is visible');
	casper.echo(indentSpacing + 'THEN \'' + elementToClick + '\' is clicked');
	casper.click(elementToClick);
	casper.waitWhileVisible(visibleArea, function success() {
		casper.test.assertNotVisible(visibleArea, '\'' + visibleArea + '\' became hidden');
	});
}

// Validate form fields
function validateForm(casper, config, formObj) {
	for (var input in formObj.fields) {

		var errorMsgSelector = '.error-msg.error-for-' + formObj.fields[input].selector.replace('#', '');

		// Insert empty value
		var errorMsgEmpty = casper.getElementAttribute(formObj.fields[input].selector, 'data-val-error-empty');
		casper.echo('Insert empty value into ' + formObj.fields[input].selector);
		casper.sendKeys(formObj.fields[input].selector, '');
		casper.echo(indentSpacing + 'THEN ' + formObj.submit + ' is clicked');
		casper.click(formObj.submit);
		casper.test.assertExists(errorMsgSelector);
		casper.test.assertSelectorHasText(errorMsgSelector, errorMsgEmpty);

		// Insert invalid value
		if (formObj.fields[input].invalidValue) {
			var errorMsgInvalid = casper.getElementAttribute(formObj.fields[input].selector, 'data-val-error-invalid');
			casper.echo('Insert invalid value ("' + formObj.fields[input].invalidValue + '") into ' + formObj.fields[input].selector);
			casper.sendKeys(formObj.fields[input].selector, formObj.fields[input].invalidValue);
			casper.echo(indentSpacing + 'THEN ' + formObj.submit + ' is clicked');
			casper.click(formObj.submit);
			casper.test.assertExists(errorMsgSelector);
			casper.test.assertSelectorHasText(errorMsgSelector, errorMsgInvalid);
		}
		
		// Insert valid value
		if (formObj.fields[input].validValue) {
			casper.echo('Insert valid value ("' + formObj.fields[input].validValue + '") into ' + formObj.fields[input].selector);
			casper.sendKeys(formObj.fields[input].selector, formObj.fields[input].validValue);
			casper.echo(indentSpacing + 'THEN ' + formObj.submit + ' is clicked');
			casper.click(formObj.submit);
			casper.test.assertDoesntExist(errorMsgSelector);
		}

		// Validate required checkbox
		if (formObj.fields[input].isRequiredCheckbox) {
			casper.echo('Select ' + formObj.fields[input].selector);
			casper.click(formObj.fields[input].selector);
			casper.echo(indentSpacing + 'THEN ' + formObj.submit + ' is clicked');
			casper.click(formObj.submit);
			casper.test.assertDoesntExist(errorMsgSelector);
		}
	}
}

// Check element attribute has expected value
function checkAttrValue(casper, elementSelector, elementAttr, expectedAttrValue) {
	var actualValue = casper.getElementAttribute(elementSelector, elementAttr).toLowerCase(),
		expectedValue = expectedAttrValue.toLowerCase();
	if (actualValue.indexOf(expectedValue) > -1) {
		casper.test.pass(elementSelector + ' attr (' + elementAttr + ') contains expected value ("' + expectedAttrValue + '")');
	} else {
		casper.test.fail(elementSelector + ' attr (' + elementAttr + ') DOES NOT contain expected value ("' + expectedAttrValue + '")');
	}
}

// Check content loaded in modal window
function checkModalContent(casper, config) {
	echoTestName(casper, 'Modal content');
	// var modalLinks = document.querySelectorAll('.modal-trig');
	// for (var link in modalLinks) {
	// 	var linkHref = casper.getElementAttribute(modalLinks[link], 'href');
	// 	casper.echo('bar');
	// 	casper.echo(linkHref);
	// }
}

// Check password visibility toggling
function checkPasswordVisibilityToggling(casper, config, inputSelector) {
	echoTestName(casper, 'Password input visibility toggling');
	var trigger = '.toggle-password-visibility-trigger';
	
	casper.echo(inputSelector + ' type is "' + casper.getElementAttribute(inputSelector, 'type') + '"');
	casper.echo(indentSpacing + 'THEN ' + trigger + ' is clicked');
	casper.click(trigger);
	casper.echo(inputSelector + ' type is "' + casper.getElementAttribute(inputSelector, 'type') + '"');
	casper.echo(indentSpacing + 'THEN ' + trigger + ' is clicked');
	casper.click(trigger);
	casper.echo(inputSelector + ' type is "' + casper.getElementAttribute(inputSelector, 'type') + '"');
}

/*
_____________________________________________________________________________________________________________________________
Global tests
_____________________________________________________________________________________________________________________________
*/

// Wrapper function for basic page checks
function basicPageCheck(casper, config, pageObj) {
	echoTestName(casper, 'Basic page check');
	checkHttpStatus(casper, pageObj.path, 200);
	casper.test.assertTitle(
		pageObj.pageTitle + config.globalPageTitleFragment
	);
	checkElementForString(casper, config, 'h1', pageObj.pageHeading);
	checkGlobalHeader(casper, config, pageObj);
	checkGlobalFooter(casper, config, pageObj);
	if (!pageObj.outOfSession) {
		// checkMainNavigation(casper, config, pageObj);
	}
}

// Check global header
function checkGlobalHeader(casper, config, pageObj) {
	echoTestName(casper, 'Global header');
	var globalHeaderSelector = '.header--global',
		siteLogoSelector = '.site-logo';
	casper.test.assertExists(globalHeaderSelector);
	// casper.test.assertExists(siteLogoSelector + ' img[src*=logo]');
	if (!pageObj.outOfSession) {
		// casper.test.assertExists(siteLogoSelector + ' a');
	}
	checkAttrValue(casper, '.header--global', 'id', 'page-top');
}

function checkMainNavigation(casper, config, pageObj) {
	echoTestName(casper, 'Main navigation');
	var mainNavToggle = '.drawer-nav__toggle',
		mainNav = '.navigation--main';
	casper.test.assertExists(mainNav);
	checkHiddenAreaIsRevealed(casper, mainNavToggle, mainNav);
	casper.then(function() {
		checkVisibleAreaIsHidden(casper, mainNavToggle, mainNav);
	});
}

function checkGlobalFooter(casper, config, pageObj) {
	echoTestName(casper, 'Global footer');
	var globalFooterSelector = '.footer--global';
	casper.test.assertExists(globalFooterSelector);
}

/*
_____________________________________________________________________________________________________________________________
Page specific tests
_____________________________________________________________________________________________________________________________
*/

// LOG IN - Wrapper function
function checkLogin(casper, config, pageObj) {
	loginFormValidation(casper, config, pageObj);
	loginForgottenPassword(casper, config, pageObj);
}

	// LOG IN - form validation
	function loginFormValidation(casper, config, pageObj) {
		echoTestName(casper, 'Log in form validation');
		var formObj = {
			selector: '#login-form',
			fields: {
				email: {
					selector: '#login',
					validValue: 'foo@bar.com'
				},
				password: {
					selector: '#password',
					validValue: '12345'
				}
			},
			submit: '#login-submit'
		};
		validateForm(casper, config, formObj);
	}

	// LOG IN - Check 'Forgotten password' link
	function loginForgottenPassword(casper, config, pageObj) {
		echoTestName(casper, 'Log in - Forgotten password');
		casper.test.assertExists('#login-form + p > a', '"Forgotten Password" link exists');
		checkAttrValue(casper, '#login-form + p > a', 'href', config.pages.login.forgottenpasswordpath);
	}

// LOG IN - Wrapper function
function checkLoggedOut(casper, config, pageObj) {
	echoTestName(casper, 'Logged out page');
	casper.test.assertExists('p > a', 'Log in link exists');
	checkAttrValue(casper, 'p > a', 'href', config.pages.login.path);
}

// REGISTER - Wrapper function
function checkRegister(casper, config, pageObj) {
	registerFormValidation(casper, config, pageObj);
	checkModalContent(casper, config);
}

	// REGISTER - Validation
	function registerFormValidation(casper, config, pageObj) {
		echoTestName(casper, 'Register form validation');
		var formObj = {
			selector: '.registration-form',
			fields: {
				firstName: {
					selector: '#register-first-name',
					validValue: 'Joe'
				},
				lastName: {
					selector: '#register-last-name',
					validValue: 'Smith'
				},
				email: {
					selector: '#register-email',
					validValue: 'foo@bar.com',
					invalidValue: 'X'
				},
				password: {
					selector: '#register-new-password',
					validValue: '1q2w3e',
					invalidValue: 'qwerty'
				},
				tandc: {
					selector: '#register-tandc',
					isRequiredCheckbox: true
				}
			},
			submit: '#registration-submit'
		};
		validateForm(casper, config, formObj);
		checkPasswordVisibilityToggling(casper, config, formObj.fields.password.selector);
	}

	// REGISTER - Privacy / T&C modal
	function registerModalLinks(casper, config, pageObj) {

	}

// DASHBOARD - Wrapper function
function checkDashboard(casper, config, pageObj) {
	checkDashboardSections(casper, config, pageObj);
}

	// DASHBOARD - Check dashboard sections
	function checkDashboardSections(casper, config, pageObj) {
		
		var sectionSelectorType = '#',
			viewAllSelector = '.header-action > a';

		var sections = {
			connections: {
				selector: 'dashboard-connections',
				heading: 'connections',
				expectedViewAllHref: '#'
			},
			media: {
				selector: 'dashboard-media',
				heading: 'images or videos',
				expectedViewAllHref: '#'
			},
			language: {
				selector: 'dashboard-language',
				heading: 'language alerts',
				expectedViewAllHref: '#'
			},
			events: {
				selector: 'dashboard-events',
				heading: 'event invitations',
				expectedViewAllHref: '#'
			},
			privacy: {
				selector: 'dashboard-privacy',
				heading: 'privacy changes',
				expectedViewAllHref: '#'
			},
			savedAlerts: {
				selector: 'dashboard-saved-alerts',
				heading: 'saved alerts',
				expectedViewAllHref: '#'
			}
		};

		// Loop through the sections and check the various elements
		for (var section in sections) {

			echoTestName(casper, sectionSelectorType + sections[section].selector);
			// Test the section exists
			casper.test.assertExists(
				sectionSelectorType + sections[section].selector
			);
			// Test the heading text
			casper.test.assertSelectorHasText(
				sectionSelectorType + sections[section].selector + ' h2',
				sections[section].heading
			);
			// Test 'View all' exists
			casper.test.assertExists(
				sectionSelectorType + sections[section].selector + ' ' + viewAllSelector
			);
			// Test the 'View all' href
			var actualViewAllHref = casper.getElementAttribute(sectionSelectorType + sections[section].selector + ' ' + viewAllSelector, 'href'),
				pattern = new RegExp(sections[section].expectedViewAllHref);
			casper.test.assertMatch(
				actualViewAllHref,
				pattern,
				sectionSelectorType + sections[section].selector + ' > ' + viewAllSelector + ' has expected href ("' + sections[section].expectedViewAllHref + '")'
			);
			// If there's a carousel present, go and test it
			if (casper.exists(sectionSelectorType + sections[section].selector + ' ' + '.carousel-wrap')) {
				checkCarousel(casper, config, pageObj, sectionSelectorType + sections[section].selector);
			}
		
		}

	}

	// DASHBOARD - Carousel
	function checkCarousel(casper, config, pageObj, parentElementSelector) {
		echoTestName(casper, parentElementSelector + ' - carousel');
		casper.test.assertExists(parentElementSelector + ' .carousel-wrap');
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