from typing import List

from selenium.webdriver.remote.webelement import WebElement


def get_classes(element: WebElement) -> List[str]:
    return str.split(element.get_attribute('class'))
