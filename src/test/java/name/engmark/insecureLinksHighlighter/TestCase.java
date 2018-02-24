package name.engmark.insecureLinksHighlighter;

import org.apache.commons.io.FileUtils;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.rules.TestWatcher;
import org.junit.runner.Description;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Arrays;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class TestCase {
    protected static WebDriver driver;

    @Rule
    public TestWatcher watcher = new TestWatcher() {
        @Override
        protected void failed(Throwable testException, Description description) {
            final String screenshotPath = String.format("/ome/gradle/project/build/%s.png", description.getMethodName());
            final File screenshotFile = new File(screenshotPath);
            final File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            try {
                FileUtils.copyFile(screenshot, screenshotFile);
            } catch (IOException exception) {
                throw new RuntimeException(exception);
            }
            super.failed(testException, description);
        }
    };

    @BeforeClass
    public static void startDriver() throws MalformedURLException {
        final URL seleniumUrl = new URL("http://selenium:4444/wd/hub");

        final FirefoxProfile profile = new FirefoxProfile();
        profile.setPreference("xpinstall.signatures.required", false);
        final File extension = new File("/home/gradle/project/insecure-links-highlighter.xpi");
        profile.addExtension(extension);

        final FirefoxOptions options = new FirefoxOptions();
        options.setProfile(profile);

        driver = new RemoteWebDriver(seleniumUrl, options);
    }

    @AfterClass
    public static void stopDriver() {
        driver.quit();
    }

    protected void assertLinkIsHighlighted(String linkText) {
        assertTrue(linkIsHighlighted(linkText));
    }

    protected void assertLinkIsNotHighlighted(String linkText) {
        assertFalse(linkIsHighlighted(linkText));
    }

    protected boolean linkIsHighlighted(String linkText) {
        final WebElement link = driver.findElement(By.linkText(linkText));
        final String[] classes = link.getAttribute("class").split(" ");
        return Arrays.asList(classes).contains("insecure-links-highlighter-highlighted");
    }
}
