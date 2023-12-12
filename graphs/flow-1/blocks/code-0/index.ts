import type { VocanaMainFunction, DefaultObject } from "@vocana/sdk";
import { CheerioCrawler, Dataset } from "crawlee";

type Props = {}
type Options = {
  url: string;
};

type Result = {
  imageURLs: string[];
}

export const main: VocanaMainFunction<Props, Result, Options> = async (props, context) => {
  const url = context.options.url;
  const imageURLs: string[] = [];
  const crawler = new CheerioCrawler({
      // Use the requestHandler to process each of the crawled pages.
      async requestHandler({ page, request, $, enqueueLinks, log }) {          const title = $("title").text();
          const selectedImages = $("amp-img").filter((_, el) => /^chapter\-img\-/.test(el.attribs["id"])).map((_, el) => el.attribs["src"]);
          for (const imageURL of selectedImages) {
            imageURLs.push(imageURL);
          }
      },
      // Let's limit our crawls to make our tests shorter and safer.
      maxRequestsPerCrawl: 50,
  });
  await crawler.run([url]);
  context.result(imageURLs, "imageURLs", true);
};
