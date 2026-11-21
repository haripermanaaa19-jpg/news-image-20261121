// Entry for make.fun's news-image-20261121: one picture that sums up the
// world news of Saturday 21 November 2026.
//
// The artwork lives in this repository as entry.png (its bytes are a JPEG;
// the gate tells PNG from JPEG by the first bytes, so the file name does
// not have to change). This program's whole job is to place those bytes at
// /output/entry.png, where the grader reads them. When the program runs
// outside the grader, MAKEFUN_OUTPUT_DIR points at the folder to use
// instead of /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Sanity-check the payload before publishing it: the gate accepts a whole
// PNG or JPEG of at most 1 MiB, recognised by its first bytes. Refuse to
// copy anything else, so a corrupt or oversized file fails loudly here
// instead of scoring zero at the gate.
const MAX_BYTES = 1_048_576;
const bytes = readFileSync(source);
const isPng =
  bytes.length >= 4 &&
  bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes; the limit is ${MAX_BYTES}`);
}
if (!isPng && !isJpeg) {
  throw new Error('entry.png is neither a PNG nor a JPEG (bad magic bytes)');
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, 'entry.png'));
