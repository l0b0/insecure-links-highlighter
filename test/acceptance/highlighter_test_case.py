import unittest

from selenium import webdriver
from selenium.webdriver.remote.webelement import WebElement

from utilities import get_classes

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

    def assert_highlighted(self, element: WebElement):
        self.assertIn('insecure-links-highlighter-highlighted', get_classes(element))

    def assert_not_highlighted(self, element: WebElement):
        self.assertNotIn('insecure-links-highlighter-highlighted', get_classes(element))
