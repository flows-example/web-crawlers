import type { VocanaMainFunction } from "@vocana/sdk";
import download from "download";
import path from "path";

type Props = {
  page: {
    title?: string;
    imageURLs: string[];
  };
}

type Result = {
  title: string;
  imagePaths: string[];
}

type Options = {
  path: string;
};

export const main: VocanaMainFunction<Props, Result, Options> = async (props, context) => {
  const random = `${Math.ceil(Math.random() * 100000)}`;
  const title = `${props.page.title ?? "default"}_${random}`;
  const dir = path.join(context.options.path, title);

  const fileNames = props.page.imageURLs.map((url, i) => `${i}${path.extname(url)}`);
  const successList = await Promise.all(props.page.imageURLs.map(async (url, i) => {
    try {
      await download(url, dir, { filename: fileNames[i] });
      return true;
    } catch (error) {
      console.log("[Download]", url, "failed");
      console.error(error);
      return false;
    }
  }));
  const imagePaths = fileNames.filter((_, i) => successList[i])
                              .map((fileName) => path.join(dir, fileName));
  await context.result(imagePaths, "imagePaths", false);
  await context.result(title, "title", true);
};