import sharp from "sharp";
import fs from "fs";
import path from "path";
import { readdir } from "node:fs/promises";

// Function to find the bounding boxes of all shapes
const findShapes = async (imagePath: string) => {
  const { data, info } = await sharp(imagePath)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const shapes: { left: number; top: number; right: number; bottom: number }[] =
    [];

  let visited = new Set<number>();
  const index = (x: number, y: number) => y * width + x;
  const isTransparent = (x: number, y: number) => {
    const i = index(x, y) * 4 + 3; // Alpha channel
    return data[i] === 0;
  };

  const floodFill = (x: number, y: number) => {
    let queue = [[x, y]];
    let left = x,
      right = x,
      top = y,
      bottom = y;

    while (queue.length > 0) {
      const [cx, cy] = queue.pop()!;
      if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
      const idx = index(cx, cy);
      if (visited.has(idx) || isTransparent(cx, cy)) continue;

      visited.add(idx);
      left = Math.min(left, cx);
      right = Math.max(right, cx);
      top = Math.min(top, cy);
      bottom = Math.max(bottom, cy);

      queue.push([cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]);
    }

    return { left, top, right, bottom };
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!isTransparent(x, y) && !visited.has(index(x, y))) {
        shapes.push(floodFill(x, y));
      }
    }
  }

  return shapes;
};
let spriteCount = 1;
// Function to extract shapes and save them as centered 16x16 images
const extractShapes = async (imagePath: string, outputDir: string) => {
  const shapes = await findShapes(imagePath);
  const image = sharp(imagePath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    let { left, top, right, bottom } = shape;

    const width = right - left + 1;
    const height = bottom - top + 1;

    // Calculate new dimensions for centered 16x16 frame
    let newLeft = left;
    let newTop = top;
    let newWidth = width;
    let newHeight = height;

    if (width !== 16 || height !== 16) {
      // Calculate centering offsets
      const xOffset = Math.floor((16 - width) / 2);
      const yOffset = Math.floor((16 - height) / 2);

      newLeft -= xOffset;
      newTop -= yOffset;
      newWidth = 16;
      newHeight = 16;
    }

    // Ensure new bounds are within the image boundaries
    newLeft = Math.max(newLeft, 0);
    newTop = Math.max(newTop, 0);

    // Extract the shape region and resize to 16x16
    const buffer = await image
      .clone() // Clone the sharp instance for each shape extraction
      .extract({
        left: newLeft,
        top: newTop,
        width: newWidth,
        height: newHeight,
      })
      .toBuffer();

    const outputPath = path.join(outputDir, `sprite-${spriteCount + 1}.png`);

    await sharp(buffer).resize(16, 16).toFile(outputPath);
  }
};

const outputDir = "sprites/output";

const files = await readdir("./sprites/source");
for (const file of files) {
  console.log(file);
  const imagePath = `sprites/source/${file}`;
  extractShapes(imagePath, outputDir)
    .then(() => {
      console.log(
        "Shapes extracted and centered in 16x16 frames successfully!"
      );
    })
    .catch((err) => {
      console.error("Error extracting shapes:", err);
    });
}
