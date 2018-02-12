import unittest

from selenium import webdriver

SELENIUM_URL = 'http://selenium:4444/wd/hub'


class UserAcceptanceTests(unittest.TestCase):
    web_driver = None

    driver = None

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Remote(
            command_executor=SELENIUM_URL,
            desired_capabilities=webdriver.DesiredCapabilities.FIREFOX
        )

    def tearDown(self):
        self.driver.save_screenshot("/screenshots/{}.png".format(self.id()))

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()

    def test_should_highlight_http_url(self):
        self.driver.get('file:///project/test/acceptance/index.html')
        link = self.driver.find_element_by_link_text('http')
        self.assert_highlighted(link)

    def assert_highlighted(self, element):
        self.assertEqual('rgb(255, 0, 0)', element.value_of_css_property('border-top-color'))
        self.assertEqual('rgb(255, 0, 0)', element.value_of_css_property('border-right-color'))
        self.assertEqual('rgb(255, 0, 0)', element.value_of_css_property('border-bottom-color'))
        self.assertEqual('rgb(255, 0, 0)', element.value_of_css_property('border-left-color'))
        self.assertEqual('solid', element.value_of_css_property('border-top-style'))
        self.assertEqual('solid', element.value_of_css_property('border-right-style'))
        self.assertEqual('solid', element.value_of_css_property('border-bottom-style'))
        self.assertEqual('solid', element.value_of_css_property('border-left-style'))
