import unittest
from typing import List, Tuple

from selenium import webdriver
from selenium.webdriver.remote.webelement import WebElement

from utilities import get_classes

SELENIUM_URL = 'http://selenium:4444/wd/hub'


class HighlighterTestCase(unittest.TestCase):
    driver = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.driver = webdriver.Remote(
            command_executor=SELENIUM_URL,
            desired_capabilities=webdriver.DesiredCapabilities.FIREFOX
        )

    def tearDown(self) -> None:
        if not self.__successful_test():
            self.driver.save_screenshot("/screenshots/{}.png".format(self.id()))

    @classmethod
    def tearDownClass(cls) -> None:
        cls.driver.close()

    def assert_highlighted(self, element: WebElement) -> None:
        self.assertIn('insecure-links-highlighter-highlighted', get_classes(element))

    def assert_not_highlighted(self, element: WebElement) -> None:
        self.assertNotIn('insecure-links-highlighter-highlighted', get_classes(element))

    def __successful_test(self) -> bool:
        result = self.__load_test_result()

        return not any(self.__problem_with_current_test(problems) for problems in [result.errors, result.failures])

    def __problem_with_current_test(self, problems: List[Tuple[unittest.TestCase, str]]) -> bool:
        return problems != [] and problems[-1][0] is self

    def __load_test_result(self) -> unittest.TestResult:
        result = self.defaultTestResult()
        self._feedErrorsToResult(result, self._outcome.errors)  # type: ignore
        return result
