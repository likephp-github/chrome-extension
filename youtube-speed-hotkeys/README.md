# Speed Hotkeys for YouTube

在 YouTube 上用快捷鍵直接切換播放速度的 Chrome 擴充功能（Manifest V3）。

## 快捷鍵

| 按鍵 | 功能 |
| --- | --- |
| `]` | 加速 0.25x（最高 4x） |
| `[` | 減速 0.25x（最低 0.25x） |
| `\` | 在 1x 與上次速度之間切換 |

- 切換時畫面上方會短暫顯示目前速度。
- 速度會被記住，換影片或重新開啟 YouTube 時自動套用。
- 在搜尋框、留言框輸入文字時不會觸發。

## 安裝

1. 開啟 `chrome://extensions`
2. 右上角開啟「開發人員模式」
3. 點「載入未封裝項目」，選擇 `youtube-speed-hotkeys` 資料夾
4. 重新整理 YouTube 頁面

## 開發

```bash
npm test        # 執行測試
npm run icons   # 重新產生 icons/（由 tools/generate-icons.js 繪製）
npm run zip     # 測試通過後打包成 dist/*.zip，供上傳 Chrome Web Store
```

- 上架資料（說明文字、權限理由）：[docs/store-listing.md](docs/store-listing.md)
- 隱私權政策：[PRIVACY.md](PRIVACY.md)
