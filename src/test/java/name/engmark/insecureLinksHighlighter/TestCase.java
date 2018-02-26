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
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class TestCase {
    protected static WebDriver driver;
    private static Path currentPath = Paths.get(System.getProperty("user.dir"));

    @Rule
    public TestWatcher watcher = new TestWatcher() {
        @Override
        protected void failed(Throwable testException, Description description) {
            final String screenshotFilename = String.format("%s.png", description.getMethodName());
            final String screenshotPath = Paths.get(currentPath.toString(), "build", screenshotFilename).toString();
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
        final File extension = new File(Paths.get(currentPath.toString(), "insecure-links-highlighter.xpi").toString());
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
