from typing import List

from selenium.webdriver.remote.webelement import WebElement


def get_classes(element: WebElement) -> List[str]:
    return element.get_attribute('class').split()
