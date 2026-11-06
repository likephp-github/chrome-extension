// 以純 Node 產生擴充功能圖示（不需外部影像工具）：靛藍圓角方塊 + 白色快轉符號
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const SIZES = [16, 32, 48, 128];
const SUPERSAMPLE = 4;
// Chrome Web Store 建議 128px 圖示的圖案為 96px，四周保留 16px 透明邊距
const PADDING = { 128: 16 };
const BG = [79, 70, 229]; // #4F46E5
const FG = [255, 255, 255];

function inRoundedRect(x, y, r) {
  const cx = Math.min(Math.max(x, r), 1 - r);
  const cy = Math.min(Math.max(y, r), 1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

function inTriangle(x, y, [a, b, c]) {
  const sign = (p1, p2) => (x - p2[0]) * (p1[1] - p2[1]) - (p1[0] - p2[0]) * (y - p2[1]);
  const d1 = sign(a, b);
  const d2 = sign(b, c);
  const d3 = sign(c, a);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

const TRIANGLES = [
  [[0.2, 0.27], [0.2, 0.73], [0.5, 0.5]],
  [[0.5, 0.27], [0.5, 0.73], [0.8, 0.5]],
];

function pixel(px, py, size) {
  const pad = (PADDING[size] || 0) / size;
  const scale = 1 - 2 * pad;
  let bg = 0;
  let fg = 0;
  const n = SUPERSAMPLE;
  for (let sy = 0; sy < n; sy++) {
    for (let sx = 0; sx < n; sx++) {
      const x = ((px + (sx + 0.5) / n) / size - pad) / scale;
      const y = ((py + (sy + 0.5) / n) / size - pad) / scale;
      if (x < 0 || x > 1 || y < 0 || y > 1) continue;
      if (!inRoundedRect(x, y, 0.22)) continue;
      if (TRIANGLES.some((t) => inTriangle(x, y, t))) fg++;
      else bg++;
    }
  }
  const covered = bg + fg;
  if (covered === 0) return [0, 0, 0, 0];
  const mix = (i) => Math.round((BG[i] * bg + FG[i] * fg) / covered);
  return [mix(0), mix(1), mix(2), Math.round((255 * covered) / (n * n))];
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(size) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const offset = y * (size * 4 + 1) + 1 + x * 4;
      Buffer.from(pixel(x, y, size)).copy(raw, offset);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = path.join(__dirname, '..', 'icons');
fs.mkdirSync(outDir, { recursive: true });
for (const size of SIZES) {
  fs.writeFileSync(path.join(outDir, `icon${size}.png`), png(size));
  console.log(`icons/icon${size}.png`);
}
