package name.engmark.insecureLinksHighlighter;

import org.junit.Before;
import org.junit.Test;

public class LocalFramesetFileTests extends TestCase {
    @Before
    public void loadPage() {
        driver.get("file:///project/src/test/resources/frameset.html");
    }

    @Test
    public void shouldHighlightHttpUrlInFrame() {
        driver.switchTo().frame("frame");
        assertLinkIsHighlighted("http");
    }
}
