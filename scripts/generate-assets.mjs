import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../assets/clarity-logo.svg", import.meta.url));
const outputs = [
  ["../assets/splash.png", 1024],
  ["../assets/icon.png", 1024],
  ["../assets/adaptive-icon.png", 1024],
];

for (const [target, size] of outputs) {
  await sharp(source)
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(new URL(target, import.meta.url)));
}
