import unittest

from highlighter_test_case import HighlighterTestCase


class TestFTP(HighlighterTestCase):
    def setUp(self) -> None:
        self.driver.get('ftp://user:password@ftpd')

    @unittest.expectedFailure
    def test_should_highlight_ftp_url(self) -> None:
        link = self.driver.find_element_by_link_text('Up to higher level directory')
        self.assert_highlighted(link)
