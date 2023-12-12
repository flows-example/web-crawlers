import type { VocanaMainFunction, DefaultObject } from "@vocana/sdk";
import download from "download";
import fs from "fs/promises";
import path from "path";

type Props = {
  in: string[];
}

type Result = {
  out: any;
}
function isImageFile(filename: string) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return imageExtensions.some((extension) => ext === extension);
}

export const main: VocanaMainFunction<Props, Result, DefaultObject> = async (props, context) => {
  const dir = context.options.path;
  const urls = props.in;
  const fileNames = urls.map((url, i) => `${i}${path.extname(url)}`);
  await Promise.all(props.in.map((url, i) => download(url, dir, { filename: fileNames[i] })));
  await context.result(fileNames.map((fileName) => path.join(dir, fileName)), "out", true);
};