(() => {
  const S = window.YTSpeed;
  const STORAGE_KEY = 'speedState';
  let state = { rate: S.DEFAULT, previous: S.DEFAULT };
  let lastAppliedSrc = null;
  let overlayTimer = null;

  function getVideo() {
    return document.querySelector('video.html5-main-video') || document.querySelector('video');
  }

  function isTyping(target) {
    if (!target) return false;
    const tag = target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
  }

  function apply() {
    const video = getVideo();
    if (!video) return;
    if (Math.abs(video.playbackRate - state.rate) > 0.001) {
      video.playbackRate = state.rate;
    }
    lastAppliedSrc = video.currentSrc;
  }

  function save() {
    chrome.storage.local.set({ [STORAGE_KEY]: state });
  }

  function showOverlay(text) {
    let el = document.getElementById('yt-speed-hotkeys-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'yt-speed-hotkeys-overlay';
      Object.assign(el.style, {
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '8px 18px',
        borderRadius: '8px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        font: '600 22px/1.2 Roboto, Arial, sans-serif',
        zIndex: '9999',
        pointerEvents: 'none',
        transition: 'opacity 0.3s',
      });
    }
    const container = document.getElementById('movie_player') || document.body;
    if (el.parentElement !== container) container.appendChild(el);
    el.textContent = text;
    el.style.opacity = '1';
    clearTimeout(overlayTimer);
    overlayTimer = setTimeout(() => {
      el.style.opacity = '0';
    }, 800);
  }

  function handleAction(action) {
    if (action === 'faster') {
      state = { ...state, rate: S.step(state.rate, 1) };
    } else if (action === 'slower') {
      state = { ...state, rate: S.step(state.rate, -1) };
    } else if (action === 'toggle') {
      state = S.toggle(state.rate, state.previous);
    }
    apply();
    save();
    showOverlay(`${state.rate}x`);
  }

  document.addEventListener(
    'keydown',
    (event) => {
      if (isTyping(event.target)) return;
      const action = S.actionForKey(event);
      if (!action || !getVideo()) return;
      event.preventDefault();
      event.stopPropagation();
      handleAction(action);
    },
    true
  );

  // 媒體事件不會冒泡，但可在 capture 階段攔到；新影片載入時套用保存的速度
  document.addEventListener('loadedmetadata', apply, true);
  document.addEventListener(
    'playing',
    () => {
      const video = getVideo();
      if (video && video.currentSrc !== lastAppliedSrc) apply();
    },
    true
  );
  document.addEventListener('yt-navigate-finish', apply);

  console.info('[Speed Hotkeys] loaded');

  chrome.storage.local.get(STORAGE_KEY, (result) => {
    if (result && result[STORAGE_KEY]) {
      state = { ...state, ...result[STORAGE_KEY] };
    }
    apply();
  });
})();
