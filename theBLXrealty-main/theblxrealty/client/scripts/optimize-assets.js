const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const srcDir = path.join(__dirname, '..');

// Recursively find files
function getFiles(dir, exts) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath, exts));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (exts.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  return results;
}

async function optimizeImages() {
  console.log('--- STARTING IMAGE OPTIMIZATION ---');
  const images = getFiles(publicDir, ['.png', '.jpg', '.jpeg']);
  const mappings = [];

  for (const imgPath of images) {
    const ext = path.extname(imgPath);
    const base = path.basename(imgPath, ext);
    const dir = path.dirname(imgPath);
    const webpPath = path.join(dir, `${base}.webp`);
    
    // Skip files like logo.svg (which is SVG, not png/jpg)
    if (ext.toLowerCase() === '.svg') {
      continue;
    }
    
    console.log(`Processing: ${path.relative(publicDir, imgPath)}`);
    try {
      let pipeline = sharp(imgPath);
      const metadata = await pipeline.metadata();
      
      // Resize if width is greater than 1920 (for large banners/backgrounds)
      if (metadata.width > 1920) {
        pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });
      }
      
      await pipeline.webp({ quality: 80 }).toFile(webpPath);
      
      const oldSize = fs.statSync(imgPath).size;
      const newSize = fs.statSync(webpPath).size;
      const reduction = ((oldSize - newSize) / oldSize * 100).toFixed(1);
      
      console.log(`  -> WebP created. Size: ${(oldSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB (${reduction}% reduction)`);
      
      // Delete original image
      fs.unlinkSync(imgPath);
      console.log(`  -> Deleted original: ${path.basename(imgPath)}`);
      
      mappings.push({
        oldName: path.basename(imgPath),
        newName: `${base}.webp`,
        oldRelative: path.relative(publicDir, imgPath).replace(/\\/g, '/'),
        newRelative: path.relative(publicDir, webpPath).replace(/\\/g, '/')
      });
    } catch (err) {
      console.error(`  Error processing ${imgPath}:`, err);
    }
  }

  console.log('--- SCANNING CODE FOR IMAGE REFERENCES ---');
  const codeFiles = getFiles(srcDir, ['.tsx', '.ts', '.css', '.html', '.js', '.mjs']).filter(f => !f.includes('node_modules') && !f.includes('.next') && !f.includes('optimize-assets.js'));

  let replacedCount = 0;
  for (const codeFile of codeFiles) {
    let content = fs.readFileSync(codeFile, 'utf8');
    let modified = false;

    for (const mapping of mappings) {
      // Create regex to match the old relative path
      const escapedOld = mapping.oldRelative.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const oldRegex = new RegExp(escapedOld, 'g');
      if (oldRegex.test(content)) {
        content = content.replace(oldRegex, mapping.newRelative);
        modified = true;
      }
      
      // Match raw file name references, like "image1.jpg" or 'image1.jpg'
      const escapedOldName = mapping.oldName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const oldNameRegex = new RegExp(`(?<=['"/])${escapedOldName}(?=['"])`, 'g');
      if (oldNameRegex.test(content)) {
        content = content.replace(oldNameRegex, mapping.newName);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(codeFile, content, 'utf8');
      console.log(`Updated image references in: ${path.relative(srcDir, codeFile)}`);
      replacedCount++;
    }
  }
  console.log(`Updated ${replacedCount} code files.`);
  console.log('--- IMAGE OPTIMIZATION COMPLETE ---');
}

optimizeImages().catch(console.error);
