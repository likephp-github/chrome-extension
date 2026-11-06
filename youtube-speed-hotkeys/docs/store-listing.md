# Chrome Web Store 上架資料

上架時可直接複製以下內容到 Developer Dashboard。

## 基本資訊

- **名稱**：Speed Hotkeys for YouTube（由 `_locales/*/messages.json` 提供）
- **分類**：工具（Tools）
- **語言**：English（預設）、中文（繁體）
- **隱私權政策網址**：https://github.com/likephp-github/chrome-extension/blob/main/youtube-speed-hotkeys/PRIVACY.md
- **支援網址**：https://github.com/likephp-github/chrome-extension/issues

## 詳細說明 — English

```
Control YouTube playback speed instantly from your keyboard — no more digging through the settings menu.

SHORTCUTS
  ]   Speed up by 0.25x (up to 4x)
  [   Slow down by 0.25x (down to 0.25x)
  \   Toggle between 1x and your last speed

FEATURES
• Goes beyond YouTube's built-in 2x limit, up to 4x
• A brief on-screen indicator shows the current speed
• Remembers your speed and applies it to every new video
• Shortcuts are ignored while typing in search or comment boxes
• Lightweight: no network requests, no tracking, no data collection

This extension is not affiliated with or endorsed by YouTube or Google.
Screenshot: "Big Buck Bunny" © Blender Foundation, CC BY 3.0 (peach.blender.org).
```

## 詳細說明 — 中文（繁體）

```
直接用鍵盤切換 YouTube 播放速度，不用再打開設定選單。

快捷鍵
  ]   加速 0.25x（最高 4x）
  [   減速 0.25x（最低 0.25x）
  \   在 1x 與上次速度之間切換

功能
• 突破 YouTube 內建 2x 上限，最高可到 4x
• 切換時畫面短暫顯示目前速度
• 記住你的速度，每部新影片自動套用
• 在搜尋框、留言框打字時不會觸發
• 輕量：不發出網路請求、不追蹤、不收集任何資料

本擴充功能與 YouTube 或 Google 無任何關聯，亦未獲其背書。
截圖影片：〈Big Buck Bunny〉© Blender Foundation，CC BY 3.0（peach.blender.org）。
```

## 隱私權分頁

**單一用途說明**
```
Lets users change the playback speed of YouTube videos with keyboard shortcuts.
```

**權限理由 — storage**
```
Used to save the user's chosen playback speed locally so it can be re-applied to subsequent videos. No data leaves the device.
```

**權限理由 — 主機權限（content script on youtube.com）**
```
The content script runs only on youtube.com to listen for the extension's keyboard shortcuts and set the playback speed of the video element.
```

**遠端程式碼**：否，未使用遠端程式碼。

**資料使用**：不勾選任何收集的資料類型，並勾選三項聲明（不販售資料給第三方、不用於與單一用途無關的目的、不用於判斷信用或放貸）。

## 圖片素材

素材檔輸出到 `dist/`（不進版控），需要時依下列方式重新產生。商店要求圖片不可有 alpha 透明層，因此截圖與宣傳圖一律轉成 JPEG。

| 欄位 | 檔案 | 產生方式 |
| --- | --- | --- |
| 商店圖示 128×128 | `icons/icon128.png` | `npm run icons` |
| 螢幕截圖 1280×800 | `dist/screenshot-1280x800.jpg` | 手動截圖（Big Buck Bunny，CC BY 3.0，說明中需標示出處），以 `sips` 裁切並轉 JPEG |
| 小型宣傳圖塊 440×280 | `dist/promo-tile-440x280.jpg` | `tools/promo-tile.html`，見下方指令 |
| 跑馬燈宣傳圖塊 1400×560 | `dist/marquee-tile-1400x560.jpg` | `tools/marquee-tile.html`，見下方指令 |

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=440,280 --screenshot="$PWD/dist/promo.png" "file://$PWD/tools/promo-tile.html"
sips -s format jpeg dist/promo.png --out dist/promo-tile-440x280.jpg
# 跑馬燈：改用 --window-size=1400,560 與 tools/marquee-tile.html
```

## 其他欄位

- **官方網址**：無（需 Search Console 驗證網域）
- **首頁網址**：https://github.com/likephp-github/chrome-extension/tree/main/youtube-speed-hotkeys
- **支援網址**：https://github.com/likephp-github/chrome-extension/issues
- **成人內容**：否

## 打包與發布

```bash
npm run zip   # 執行測試後輸出 dist/speed-hotkeys-for-youtube-<version>.zip
```

更新版本時，同時修改 `manifest.json` 與 `package.json` 的 `version`（測試會檢查兩者一致）。
