from selenium.webdriver.common.action_chains import ActionChains

from test.acceptance.highlighter_test_case import HighlighterTestCase


class TestLocalFile(HighlighterTestCase):
    def setUp(self):
        self.driver.get('file:///project/test/acceptance/index.html')

    def test_should_highlight_http_url(self):
        link = self.driver.find_element_by_link_text('http')
        self.assert_highlighted(link)

    def test_should_not_highlight_https_url(self):
        link = self.driver.find_element_by_link_text('https')
        self.assert_not_highlighted(link)

    def test_should_highlight_http_url_with_custom_css(self):
        link = self.driver.find_element_by_link_text('styled')
        self.assert_highlighted(link)

    def test_should_highlight_http_url_which_is_injected_into_dom(self):
        link = self.driver.find_element_by_link_text('injected')
        self.assert_highlighted(link)

    def test_should_highlight_url_which_is_changed_to_http_when_moused_over(self):
        link = self.driver.find_element_by_link_text('modify on mouse over')
        self.assert_not_highlighted(link)
        ActionChains(self.driver).move_to_element(link).perform()
        self.assert_highlighted(link)
