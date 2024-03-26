import type { VocanaMainFunction, DefaultObject } from "@vocana/sdk";
import { CheerioCrawler, Dataset } from "crawlee";

type Inputs = {
  url: string;
  maxResponse?: number;
}

type Outputs = {
  capterURLs: string[];
}

export const main: VocanaMainFunction<Inputs, Outputs> = async (inputs, context) => {
  const url = inputs.url;
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

  if (typeof inputs.maxResponse === "number") {
    capterURLs.splice(inputs.maxResponse);
  }
  await context.output(capterURLs, "capterURLs", true);
};
