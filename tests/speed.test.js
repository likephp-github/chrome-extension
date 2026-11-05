const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../src/speed.js');

test('加速一次增加 0.25', () => {
  assert.equal(S.step(1, 1), 1.25);
});

test('減速一次減少 0.25', () => {
  assert.equal(S.step(1, -1), 0.75);
});

test('速度不會超過上限', () => {
  assert.equal(S.step(S.MAX, 1), S.MAX);
});

test('速度不會低於下限', () => {
  assert.equal(S.step(S.MIN, -1), S.MIN);
});

test('非 1x 時切換回 1x 並記住目前速度', () => {
  assert.deepEqual(S.toggle(1.75, 1), { rate: 1, previous: 1.75 });
});

test('1x 時切換回上次速度', () => {
  assert.deepEqual(S.toggle(1, 1.75), { rate: 1.75, previous: 1.75 });
});

test('1x 且無上次速度時維持 1x', () => {
  assert.equal(S.toggle(1, 1).rate, 1);
});

test('按鍵對應動作', () => {
  assert.equal(S.actionForKey({ key: ']' }), 'faster');
  assert.equal(S.actionForKey({ key: '[' }), 'slower');
  assert.equal(S.actionForKey({ key: '\\' }), 'toggle');
});

test('帶修飾鍵或其他按鍵時不觸發', () => {
  assert.equal(S.actionForKey({ key: ']', metaKey: true }), null);
  assert.equal(S.actionForKey({ key: 'a' }), null);
});
