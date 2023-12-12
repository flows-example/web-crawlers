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
  await Promise.all(props.in.map(url => download(url, dir)));
  const files = await fs.readdir(dir);
  const dirs = files.filter(file => isImageFile(file)).map(file => {
    return path.join(dir, file);
  });
  await context.result(dirs || "", "out", true);
};