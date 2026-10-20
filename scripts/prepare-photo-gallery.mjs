import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDirectory = join(root, 'public/photos');
const outputDirectory = join(root, 'public/images/photo-gallery');
const manifestPath = join(root, 'src/generated/photo-gallery.json');
const { descriptions = {} } = JSON.parse(await readFile(join(root, 'src/data/photo-gallery.json'), 'utf8'));

// Ignore near-black shadows and near-white highlights when finding the scene's
// characteristic color, rather than letting either flatten every palette.
async function palette(buffer) {
  const { data, info } = await sharp(buffer).rotate().resize(64, 64, { fit: 'fill' })
    .removeAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
  const bins = Array.from({ length: 36 }, () => ({ weight: 0, r: 0, g: 0, b: 0, light: 0 }));
  let colorful = 0;
  let overallLight = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
    const light = (max + min) / 2;
    overallLight += light;
    if (delta < 0.08 || light < 0.09 || light > 0.92) continue;
    const saturation = delta / (1 - Math.abs(2 * light - 1));
    let hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
    hue = (hue * 60 + 360) % 360;
    const weight = (0.15 + saturation) * (1 - Math.abs(light - 0.5));
    const bin = bins[Math.floor(hue / 10)];
    bin.weight += weight;
    bin.r += r * weight; bin.g += g * weight; bin.b += b * weight;
    bin.light += light * weight;
    colorful++;
  }
  const strongest = bins.reduce((best, bin, i) => bin.weight > bins[best].weight ? i : best, 0);
  const bin = bins[strongest];
  const hue = strongest * 10 + 5;
  const neutral = colorful < 4096 * 0.12;
  const group = neutral ? 5 : hue < 65 || hue >= 335 ? 0 : hue < 165 ? 1 : hue < 200 ? 2 : hue < 260 ? 3 : 4;
  const labels = ['Warm tones', 'Greens', 'Teals', 'Blues', 'Violets', 'Neutrals'];
  return {
    group, label: labels[group], hue,
    light: bin.weight ? bin.light / bin.weight : overallLight / 4096,
    color: bin.weight ? '#' + ['r', 'g', 'b'].map(key => Math.round(bin[key] / bin.weight * 255).toString(16).padStart(2, '0')).join('') : '#888888',
  };
}

await mkdir(outputDirectory, { recursive: true });
await mkdir(join(root, 'src/generated'), { recursive: true });
const existing = new Set(await readdir(outputDirectory));
const files = (await readdir(sourceDirectory))
  .filter((file) => /\.(jpe?g|png|gif|webp)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, 'en'));

let generated = 0;
const photos = [];
const seen = new Map();
for (const [index, file] of files.entries()) {
  const buffer = await readFile(join(sourceDirectory, file));
  const metadata = await sharp(buffer).metadata();
  const swapped = [5, 6, 7, 8].includes(metadata.orientation);
  const width = swapped ? metadata.height : metadata.width;
  const height = swapped ? metadata.width : metadata.height;
  if (!width || !height) throw new Error(`Cannot read photo dimensions: ${file}`);

  const hash = createHash('sha256').update('photo-gallery-v1').update(buffer).digest('hex').slice(0, 12);
  if (seen.has(hash)) {
    console.log(`Skipping duplicate ${file}; already included as ${seen.get(hash)}.`);
    continue;
  }
  seen.set(hash, file);
  const sizes = [...new Set([480, 960, 2400].map((size) => Math.min(size, width)))];
  const variants = [];
  for (const size of sizes) {
    const name = `${hash}-${size}.webp`;
    if (!existing.has(name)) {
      await sharp(buffer).rotate().resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 84 }).toFile(join(outputDirectory, name));
      generated++;
    }
    variants.push({ width: size, src: `/images/photo-gallery/${name}` });
  }

  photos.push({
    id: hash,
    file,
    alt: descriptions[file] || `Photo ${index + 1} from Avi’s collection`,
    width,
    height,
    src: variants[0].src,
    srcSet: variants.filter((variant) => variant.width <= 960)
      .map((variant) => `${variant.src} ${variant.width}w`).join(', '),
    fullSrc: variants.at(-1).src,
    originalSrc: `/photos/${encodeURIComponent(file)}`,
    palette: await palette(buffer),
  });
}

photos.sort((a, b) => a.palette.group - b.palette.group ||
  (a.palette.group === 5 ? a.palette.light - b.palette.light : a.palette.hue - b.palette.hue || a.palette.light - b.palette.light) ||
  a.file.localeCompare(b.file, 'en'));

const manifest = `${JSON.stringify(photos, null, 2)}\n`;
const previous = await readFile(manifestPath, 'utf8').catch((error) => {
  if (error.code === 'ENOENT') return '';
  throw error;
});
if (previous !== manifest) await writeFile(manifestPath, manifest);
console.log(`Photo gallery: ${photos.length} photos, ${generated} previews generated.`);
