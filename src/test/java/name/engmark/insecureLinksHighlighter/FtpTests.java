package name.engmark.insecureLinksHighlighter;

import org.junit.Before;
import org.junit.Test;

public class FtpTests extends TestCase {
    @Before
    public void loadPage() {
        driver.get("ftp://user:password@ftpd");
    }

    @Test
    public void shouldHighlightParentDirectoryUrl() {
        assertLinkIsHighlighted("Up to higher level directory");
    }
}
