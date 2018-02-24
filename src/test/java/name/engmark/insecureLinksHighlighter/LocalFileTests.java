package name.engmark.insecureLinksHighlighter;

import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

public class LocalFileTests extends TestCase {
    @Before
    public void loadPage() {
        driver.get("file:///project/src/test/resources/index.html");
    }

    @Test
    public void shouldHighlightHttpUrl() {
        assertLinkIsHighlighted("http");
    }

    @Test
    public void shouldNotHighlightHttpsUrl() {
        assertLinkIsNotHighlighted("https");
    }

    @Test
    public void shouldHighlightHttpUrlWithCustomCss() {
        assertLinkIsHighlighted("styled");
    }

    @Test
    public void shouldHighlightHttpUrlWhichIsInjectedIntoDom() {
        assertLinkIsHighlighted("injected");
    }

    @Test
    public void shouldHighlightUrlWhichChangesToHttpWhenMousedOver() {
        final String linkText = "modify on mouse over";

        final WebElement link = driver.findElement(By.linkText(linkText));
        final Actions actions = new Actions(driver);
        actions.moveToElement(link).build().perform();

        assertLinkIsHighlighted(linkText);
    }

    @Test
    public void shouldHighlightUrlWithOnmousedownHandler() {
        assertLinkIsHighlighted("modify on mouse down");
    }

}
