import { promises as fs } from 'node:fs';
import path from 'node:path';
export async function appendJsonl(filePath, obj) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  const line = JSON.stringify(obj) + '\n';
  await fs.appendFile(filePath, line, { encoding: 'utf8' });
}
