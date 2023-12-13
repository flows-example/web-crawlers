import scrapy

from selenium.webdriver.common.by import By
from scrapy_selenium import SeleniumRequest
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

class ChapterSpider(scrapy.Spider):
    name = "chapter"

    def __init__(self, url):
      self.start_urls = [url]

    def start_requests(self):
      for url in self.start_urls:
        yield SeleniumRequest(url=url, callback=self.parse)

    def parse(self, response):
      driver = response.request.meta["driver"]
      button = driver.find_element(By.id(By.CSS_SELECTOR, "#button_show_all_chatper"))
      button.click()

      for chapter in response.css("#chapter-items a.comics-chapters__item"):
        yield { "chapter_url": chapter.attrib["href"] }

def main(props, context):
  process = CrawlerProcess(get_project_settings())
  process.crawl(ChapterSpider, url=context.options.get("url"))
  results = []

  def crawler_results(item, response, spider):
    results.append(item)

  for p in process.crawlers:
    p.signals.connect(crawler_results, signal=scrapy.signals.item_scraped)

  process.start()
  chapter_urls = list(map(lambda r: r["chapter_url"], results))
  context.result(chapter_urls, "chapterURLs", True)