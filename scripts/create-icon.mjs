import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

async function createIcon() {
    const inputPath = join(projectRoot, 'logo.png');
    const outputPng = join(projectRoot, 'build', 'icon.png');
    
    // Resize to 256x256 PNG
    await sharp(inputPath)
        .resize(256, 256, {
            fit: 'contain',
            background: { r: 15, g: 23, b: 42, alpha: 1 } // slate-900 background
        })
        .png()
        .toFile(outputPng);
    
    console.log('Created 256x256 icon.png');
    
    // Create multiple sizes for ICO
    const sizes = [16, 32, 48, 64, 128, 256];
    const images = [];
    
    for (const size of sizes) {
        const buffer = await sharp(inputPath)
            .resize(size, size, {
                fit: 'contain',
                background: { r: 15, g: 23, b: 42, alpha: 1 }
            })
            .png()
            .toBuffer();
        images.push({ size, buffer });
    }
    
    // Create ICO file manually
    const icoBuffer = createICO(images);
    const outputIco = join(projectRoot, 'build', 'icon.ico');
    writeFileSync(outputIco, icoBuffer);
    
    console.log('Created icon.ico with multiple sizes');
}

function createICO(images) {
    // ICO file header
    const headerSize = 6;
    const dirEntrySize = 16;
    const numImages = images.length;
    
    // Calculate total size and offsets
    let offset = headerSize + (dirEntrySize * numImages);
    const offsets = [];
    
    for (const img of images) {
        offsets.push(offset);
        offset += img.buffer.length;
    }
    
    // Create header
    const header = Buffer.alloc(headerSize);
    header.writeUInt16LE(0, 0);      // Reserved
    header.writeUInt16LE(1, 2);      // Type (1 = ICO)
    header.writeUInt16LE(numImages, 4); // Number of images
    
    // Create directory entries
    const directory = Buffer.alloc(dirEntrySize * numImages);
    
    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const entryOffset = i * dirEntrySize;
        
        directory.writeUInt8(img.size === 256 ? 0 : img.size, entryOffset);     // Width
        directory.writeUInt8(img.size === 256 ? 0 : img.size, entryOffset + 1); // Height
        directory.writeUInt8(0, entryOffset + 2);                               // Color palette
        directory.writeUInt8(0, entryOffset + 3);                               // Reserved
        directory.writeUInt16LE(1, entryOffset + 4);                            // Color planes
        directory.writeUInt16LE(32, entryOffset + 6);                           // Bits per pixel
        directory.writeUInt32LE(img.buffer.length, entryOffset + 8);            // Size of image data
        directory.writeUInt32LE(offsets[i], entryOffset + 12);                  // Offset to image data
    }
    
    // Combine all parts
    const buffers = [header, directory, ...images.map(img => img.buffer)];
    return Buffer.concat(buffers);
}

createIcon().catch(console.error);
