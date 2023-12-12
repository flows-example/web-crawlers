import type { VocanaMainFunction, DefaultObject } from "@vocana/sdk";
import { CheerioCrawler, Dataset } from "crawlee";

type Props = {
  url: string;
}

type Result = {
  title?: string;
  imageURLs: string[];
}

export const main: VocanaMainFunction<Props, Result> = async (props, context) => {
  const url = props.url;
  const imageURLs: string[] = [];
  let mangaTitle: string | undefined;
  const crawler = new CheerioCrawler({
      // Use the requestHandler to process each of the crawled pages.
      async requestHandler({ page, request, $, enqueueLinks, log }) {          
        const title = ($("span.title")[0].children[0] as Record<string, any>).data        
        const selectedImages = $("amp-img").filter((_, el) => /^chapter\-img\-/.test(el.attribs["id"])).map((_, el) => el.attribs["src"]);
        for (const imageURL of selectedImages) {
          imageURLs.push(imageURL);
        }
        if (title) {
          mangaTitle = title;
        }
      },
      // Let's limit our crawls to make our tests shorter and safer.
      maxRequestsPerCrawl: 50,
  });
  await crawler.run([url]);

  if (mangaTitle) {
    context.result(mangaTitle, "title", false);
  }
  context.result(imageURLs, "imageURLs", true);
};
