package name.engmark.insecureLinksHighlighter;

import org.junit.Before;
import org.junit.Ignore;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class ConfigurationTests extends TestCase {
    @Before
    public void loadPage() {
        driver.get("about:addons");
        driver.findElement(By.id("category-extension")).click();
        final WebElement extensionEntry = driver.findElement(By.name("Insecure Links Highlighter"));
        extensionEntry.findElement(By.className("preferences")).click();
    }

    @Ignore
    public void shouldHaveDefaultConfiguration() {
    }
}
