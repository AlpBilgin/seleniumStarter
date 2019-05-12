var webdriver = require('selenium-webdriver');
var selenium = require('selenium-standalone');

//Base server settings
var settings = {
    baseURL: 'https://selenium-release.storage.googleapis.com',
    version: '3.141.5',
    drivers: {
        chrome: {
            version: '2.43',
            arch: process.arch,
            baseURL: 'https://chromedriver.storage.googleapis.com'
        }
    }
}

// Session capabilities
var capabilities = {
    'browserName': 'chrome',
    'version': '',
    'platform': 'WINDOWS'
}

// Create driver, set server URL, set capabilities
var driver = new webdriver.Builder().
    usingServer('http://0.0.0.0:4444/wd/hub').
    withCapabilities(capabilities).
    build();

// Define test with the assumption that global driver var will be ready when called
function testSuite(child) {
    driver.get('http://kahramangiller.com').then(function () {
        const kahramangilLogo = driver.findElement(webdriver.By.className('logo'))
        kahramangilLogo.findElement(webdriver.By.className('custom-logo')).then(
            resim => {
                resim.getAttribute('src').then(
                    src => {
                        try {
                            if (src !== 'https://kahramangiller.com/wp-content/uploads/2017/12/logo.png') {
                                throw new Error('resim yanlış')
                            } else {
                                console.log('resim orda');
                            }
                        } catch (e) {
                            console.log(e);
                        } finally {
                            // CLEANUP shut down automation session and then pull the plug on the server
                            driver.quit().then(
                                () => child ? child.kill() : null
                            )
                        }
                    }
                )
            }
        )
    });
}

// Install and start server
selenium.install(settings, (err) => {
    selenium.start(settings, (err, child) => {
        // Perform tests
        testSuite(child);
    });
});




