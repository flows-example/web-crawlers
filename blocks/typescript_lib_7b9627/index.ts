import type { VocanaMainFunction } from "@vocana/sdk";
import {jsPDF} from "jspdf";
import sizeOf from "image-size";
import fs from "fs";

type Inputs = {
  path: string;
  title: string;
  imagePathes: string[];
}

type Outputs = {
  out: any;
}

const generatePdf = async (imageUrls: string[]): Promise<jsPDF> => {
  const doc = new jsPDF("p", "px", "a4");
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  for (const [i, url] of imageUrls.entries()) {
      const urlBuffer = fs.readFileSync(url)
      const dimensions = sizeOf(urlBuffer);
      if (dimensions.width && dimensions.height) {
          let x = 0;
          let y = 0;
          let imageWidth = dimensions.width;
          let imageHeight = dimensions.height;
          const ratio = imageWidth/imageHeight;

          if (imageWidth > imageHeight) {
              imageWidth = width;
              imageHeight = imageWidth / ratio;
              y = (height - imageHeight) / 2;
          } else {
              imageHeight = height;
              imageWidth = ratio * imageHeight;
              x = (width - imageWidth) / 2
          }

          doc.addImage(urlBuffer, "JPEG", x, y, imageWidth, imageHeight);
          if (i !== imageUrls.length - 1) {
              doc.addPage();
          }
      }
  }
  return doc;
}
export const main: VocanaMainFunction<Inputs, Outputs> = async (inputs, context) => {
  const pdf = await generatePdf(inputs.imagePathes);
  const fileName = inputs.title;
  pdf.save(`${inputs.path}/${fileName}.pdf`);
  await context.done();
};