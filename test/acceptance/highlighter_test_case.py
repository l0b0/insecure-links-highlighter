import unittest

from selenium import webdriver

SELENIUM_URL = 'http://selenium:4444/wd/hub'


class HighlighterTestCase(unittest.TestCase):
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

    def assert_highlighted(self, element):
        self.assertEqual('rgb(255, 0, 0)', element.value_of_css_property('border-top-color'))
        self.assertEqual('rgb(255, 0, 0)', element.value_of_css_property('border-right-color'))
        self.assertEqual('rgb(255, 0, 0)', element.value_of_css_property('border-bottom-color'))
        self.assertEqual('rgb(255, 0, 0)', element.value_of_css_property('border-left-color'))
        self.assertEqual('solid', element.value_of_css_property('border-top-style'))
        self.assertEqual('solid', element.value_of_css_property('border-right-style'))
        self.assertEqual('solid', element.value_of_css_property('border-bottom-style'))
        self.assertEqual('solid', element.value_of_css_property('border-left-style'))

    def assert_not_highlighted(self, element):
        self.assertEqual('rgb(0, 0, 238)', element.value_of_css_property('border-top-color'))
        self.assertEqual('rgb(0, 0, 238)', element.value_of_css_property('border-right-color'))
        self.assertEqual('rgb(0, 0, 238)', element.value_of_css_property('border-bottom-color'))
        self.assertEqual('rgb(0, 0, 238)', element.value_of_css_property('border-left-color'))
        self.assertEqual('none', element.value_of_css_property('border-top-style'))
        self.assertEqual('none', element.value_of_css_property('border-right-style'))
        self.assertEqual('none', element.value_of_css_property('border-bottom-style'))
        self.assertEqual('none', element.value_of_css_property('border-left-style'))
