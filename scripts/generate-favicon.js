const fs = require("fs");
const path = require("path");

// Create a minimal 32x32 RGBA BMP-in-ICO or standard 16x16/32x32 ICO
// We will create a valid 16x16 32-bit BMP ICO for maximum compatibility
function createIcoBuffer() {
  const width = 16;
  const height = 16;
  const bpp = 32;

  // ICO Header: 6 bytes
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type: 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // Count of images: 1

  // BMP InfoHeader: 40 bytes
  const biHeader = Buffer.alloc(40);
  biHeader.writeUInt32LE(40, 0); // Header size
  biHeader.writeInt32LE(width, 4); // Width
  biHeader.writeInt32LE(height * 2, 8); // Height * 2 (for ICO mask + image)
  biHeader.writeUInt16LE(1, 12); // Planes
  biHeader.writeUInt16LE(bpp, 14); // Bit count (32-bit RGBA)
  biHeader.writeUInt32LE(0, 16); // Compression (BI_RGB)
  biHeader.writeUInt32LE(width * height * 4, 20); // Image size
  biHeader.writeInt32LE(0, 24); // X pixels per meter
  biHeader.writeInt32LE(0, 28); // Y pixels per meter
  biHeader.writeUInt32LE(0, 32); // Colors used
  biHeader.writeUInt32LE(0, 36); // Important colors

  // Pixel Data (16x16 RGBA in bottom-up order)
  // Krishna Blue: BGRA (0xA6, 0x57, 0x24, 0xFF)
  // Warm Ivory: BGRA (0xE5, 0xF1, 0xF7, 0xFF)
  // Gurukul Saffron: BGRA (0x2B, 0x82, 0xD9, 0xFF)
  const pixelData = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - 7.5;
      const dy = y - 7.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= 2) {
        // Saffron center
        pixelData[idx] = 0x2B;     // B
        pixelData[idx + 1] = 0x82; // G
        pixelData[idx + 2] = 0xD9; // R
        pixelData[idx + 3] = 0xFF; // A
      } else if (dist <= 5) {
        // Krishna Blue eye
        pixelData[idx] = 0xA6;     // B
        pixelData[idx + 1] = 0x57; // G
        pixelData[idx + 2] = 0x24; // R
        pixelData[idx + 3] = 0xFF; // A
      } else if (dist <= 7) {
        // Soft Sand contour
        pixelData[idx] = 0xBF;     // B
        pixelData[idx + 1] = 0xD9; // G
        pixelData[idx + 2] = 0xE8; // R
        pixelData[idx + 3] = 0xCC; // A
      } else {
        // Transparent
        pixelData[idx] = 0;
        pixelData[idx + 1] = 0;
        pixelData[idx + 2] = 0;
        pixelData[idx + 3] = 0;
      }
    }
  }

  // 1-bit AND Mask (16x16 bits = 2 bytes per row * 16 = 32 bytes)
  const andMask = Buffer.alloc((width / 8) * height, 0);

  const imageSize = biHeader.length + pixelData.length + andMask.length;

  // ICO Directory Entry: 16 bytes
  const icoDir = Buffer.alloc(16);
  icoDir.writeUInt8(width, 0); // Width
  icoDir.writeUInt8(height, 1); // Height
  icoDir.writeUInt8(0, 2); // Colors in palette
  icoDir.writeUInt8(0, 3); // Reserved
  icoDir.writeUInt16LE(1, 4); // Color planes
  icoDir.writeUInt16LE(bpp, 6); // Bits per pixel
  icoDir.writeUInt32LE(imageSize, 8); // Size of image data
  icoDir.writeUInt32LE(6 + 16, 12); // Offset of image data

  return Buffer.concat([icoHeader, icoDir, biHeader, pixelData, andMask]);
}

const icoBuffer = createIcoBuffer();
fs.writeFileSync(path.join(__dirname, "../public/favicon.ico"), icoBuffer);
fs.writeFileSync(path.join(__dirname, "../app/favicon.ico"), icoBuffer);
console.log("Successfully generated public/favicon.ico and app/favicon.ico");
