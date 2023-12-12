import type { VocanaMainFunction, DefaultObject } from "@vocana/sdk";
import { CheerioCrawler, Dataset } from "crawlee";

type Props = {}
type Options = {
  url: string;
  maxResponse: number;
};

type Result = {
  capterURL: string;
}

export const main: VocanaMainFunction<Props, Result, Options> = async (props, context) => {
  const url = context.options.url;
  const capterURLs: string[] = [];

  let mangaTitle: string | undefined;
  const crawler = new CheerioCrawler({
      // Use the requestHandler to process each of the crawled pages.
      async requestHandler({ page, request, $, enqueueLinks, log }) {          
        for (const el of $("#chapter-items a.comics-chapters__item")) {
          capterURLs.push(`https://www.baozimh.com${el.attribs["href"]}`);
        }
      },
      // Let's limit our crawls to make our tests shorter and safer.
      maxRequestsPerCrawl: 50,
  });
  await crawler.run([url]);

  capterURLs.splice(context.options.maxResponse);

  for (const url of capterURLs) {
    context.result(url, "capterURL", false);
  }
  await context.done();
};
