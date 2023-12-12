import type { VocanaMainFunction } from "@vocana/sdk";
import download from "download";
import fs from "fs/promises";
import path from "path";

type Props = {
  imageURLs: string[];
}

type Result = {
  imagePathes: string[];
}

type Options = {
  path: string;
};

export const main: VocanaMainFunction<Props, Result, Options> = async (props, context) => {
  const dir = context.options.path;
  const fileNames = props.imageURLs.map((url, i) => `${i}${path.extname(url)}`);
  await Promise.all(props.imageURLs.map((url, i) => download(url, dir, { filename: fileNames[i] })));
  await context.result(fileNames.map((fileName) => path.join(dir, fileName)), "imagePathes", true);
};