import { promises, mkdirSync, rmSync } from 'fs';
import path from 'path';
import os from 'os';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { nodeFileTrace } from '../out/node-file-trace.js';

const { writeFile } = promises;
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const randomTmpId = Math.random().toString().slice(2);
const tmpdir = path.resolve(
  os.tmpdir(),
  `node-file-trace-ecmascript${randomTmpId}`,
);
rmSync(tmpdir, { recursive: true, force: true });
mkdirSync(tmpdir);
console.log('created directory ' + tmpdir);

// These are tests known to fail so we skip them
const ignoreCategories = new Set([
  'Generator function.sent Meta Property',
  'Class and Property Decorators',
  'throw expressions',
  'RegExp Pattern Modifiers',
  'Duplicate named capturing groups',
]);

function runTests(importPath) {
  const { tests } = require(importPath);
  for (const category of tests) {
    const subtests = category.subtests || [category];
    for (const test of subtests) {
      const { name, exec } = test;
      if (ignoreCategories.has(category.name)) {
        continue;
      }
      it(`should correctly trace ${importPath} "${category.name}" "${name}"`, async () => {
        let str = exec
          .toString()
          .replace(/\{\s*\/\*/, '{')
          .replace(/\*\/\s*\}/, '}');
        str = `var obj = { exec: ${str} }`;
        const filename = path.join(
          tmpdir,
          `test${Math.random().toString().slice(2)}.js`,
        );
        await writeFile(filename, str, 'utf8');
        const { fileList, warnings } = await nodeFileTrace([filename], {
          base: `${__dirname}/../`,
          processCwd: path.dirname(filename),
          ts: true,
          log: true,
          mixedModules: true,
        });
        if (warnings.size > 0) {
          console.log(warnings);
        }
        expect(warnings.size).toBe(0);
        expect(fileList.size).toBe(1);
      });
    }
  }
}

runTests('./ecmascript/data-es5');
runTests('./ecmascript/data-es6');
runTests('./ecmascript/data-es2016plus');
runTests('./ecmascript/data-esnext');
runTests('./ecmascript/data-esintl');
