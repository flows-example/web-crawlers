import type { VocanaMainFunction, DefaultObject } from "@vocana/sdk";
import { CheerioCrawler, Dataset } from "crawlee";

type Props = {
  in: string;
}

type Result = {
  out: string;
}

export const main: VocanaMainFunction<Props, Result, DefaultObject> = async (props, context) => {
  const crawler = new CheerioCrawler({
      // Use the requestHandler to process each of the crawled pages.
      async requestHandler({ request, $, enqueueLinks, log }) {
          const title = $('title').text();
          log.info(`Title of ${request.loadedUrl} is '${title}'`);

          // Save results as JSON to ./storage/datasets/default
          // await Dataset.pushData({ title, url: request.loadedUrl });

          // Extract links from the current page
          // and add them to the crawling queue.
          await enqueueLinks();
      },

      // Let's limit our crawls to make our tests shorter and safer.
      maxRequestsPerCrawl: 50,
  });
  await crawler.run(["https://crawlee.dev"]);
  // your code
  await context.result(props.in || "", "out", true);
};
