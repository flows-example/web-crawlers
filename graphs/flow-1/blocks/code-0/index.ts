import type { VocanaMainFunction, DefaultObject } from "@vocana/sdk";
import { CheerioCrawler, Dataset } from "crawlee";

type Props = {
  capterURLs: string[];
};

type Result = {
  page: Page;
};

type Page = {
  title?: string;
  imageURLs: string[];
};

export const main: VocanaMainFunction<Props, Result> = async (props, context) => {
  const pages: Page[] = [];
  const crawler = new CheerioCrawler({
      // Use the requestHandler to process each of the crawled pages.
      async requestHandler({ page, request, $, enqueueLinks, log }) {          
        const title = ($("span.title")[0].children[0] as Record<string, any>).data;
        const imageURLs: string[] = [];    
        const selectedImages = $("amp-img").filter((_, el) => /^chapter\-img\-/.test(el.attribs["id"])).map((_, el) => el.attribs["src"]);

        for (const imageURL of selectedImages) {
          imageURLs.push(imageURL);
        }
        const pageItem: Page = { imageURLs };
        if (title) {
          pageItem.title = title;
        }
        pages.push(pageItem);
      },
      // Let's limit our crawls to make our tests shorter and safer.
      maxRequestsPerCrawl: 50,
  });
  await crawler.run(props.capterURLs);

  for (const page of pages) {
    context.result(page, "page", false);
  }
  await context.done();
};
