const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const manifest = read('manifest.json');

test('manifest 版本與 package.json 一致（打包檔名依 package.json 版本）', () => {
  assert.equal(manifest.version, read('package.json').version);
});

test('manifest 引用的圖示與腳本檔案都存在', () => {
  const files = [
    ...Object.values(manifest.icons),
    ...manifest.content_scripts.flatMap((cs) => cs.js),
  ];
  const missing = files.filter((file) => !fs.existsSync(path.join(root, file)));
  assert.deepEqual(missing, []);
});

test('每個語系都提供 manifest 使用的所有訊息', () => {
  const keys = JSON.stringify(manifest)
    .match(/__MSG_(\w+)__/g)
    .map((m) => m.slice(6, -2));
  for (const locale of fs.readdirSync(path.join(root, '_locales'))) {
    const messages = read(`_locales/${locale}/messages.json`);
    const missing = keys.filter((key) => !messages[key]);
    assert.deepEqual(missing, [], `語系 ${locale} 缺少訊息`);
  }
});
