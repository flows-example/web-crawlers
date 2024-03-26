import type { VocanaMainFunction } from "@vocana/sdk";
import download from "download";
import path from "path";

type Inputs = {
  path: string;
  page: {
    title?: string;
    imageURLs: string[];
  };
}

type Outputs = {
  title: string;
  imagePaths: string[];
}

export const main: VocanaMainFunction<Inputs, Outputs> = async (inputs, context) => {
  const random = `${Math.ceil(Math.random() * 100000)}`;
  const title = `${inputs.page.title ?? "default"}_${random}`;
  const dir = path.join(inputs.path, title);

  const fileNames = inputs.page.imageURLs.map((url, i) => `${i}${path.extname(url)}`);
  const successList = await Promise.all(inputs.page.imageURLs.map(async (url, i) => {
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
  await context.output(imagePaths, "imagePaths", false);
  await context.output(title, "title", true);
};