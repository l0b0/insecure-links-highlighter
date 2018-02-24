package name.engmark.insecureLinksHighlighter;

import org.junit.Before;
import org.junit.Ignore;

public class FtpTests extends TestCase {
    @Before
    public void loadPage() {
        driver.get("ftp://user:password@ftpd");
    }

    @Ignore
    public void shouldHighlightParentDirectoryUrl() {
        assertLinkIsHighlighted("Up to higher level directory");
    }
}
