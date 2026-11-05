// 純邏輯：速度計算與按鍵對應（可在 Node 中測試，也會以 window.YTSpeed 提供給 content script）
(function (root) {
  const MIN = 0.25;
  const MAX = 4;
  const STEP = 0.25;
  const DEFAULT = 1;

  function clamp(rate) {
    return Math.min(MAX, Math.max(MIN, rate));
  }

  function round(rate) {
    return Math.round(rate * 100) / 100;
  }

  // direction: +1 加速, -1 減速
  function step(current, direction) {
    return clamp(round(current + direction * STEP));
  }

  // 非 1x 時切回 1x 並記住目前速度；在 1x 時切回記住的速度
  function toggle(current, previous) {
    if (current !== DEFAULT) {
      return { rate: DEFAULT, previous: current };
    }
    const target = previous && previous !== DEFAULT ? previous : DEFAULT;
    return { rate: target, previous };
  }

  function actionForKey(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return null;
    switch (event.key) {
      case ']':
        return 'faster';
      case '[':
        return 'slower';
      case '\\':
        return 'toggle';
      default:
        return null;
    }
  }

  const api = { MIN, MAX, STEP, DEFAULT, step, toggle, actionForKey };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.YTSpeed = api;
  }
})(this);
