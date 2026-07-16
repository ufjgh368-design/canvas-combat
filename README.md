# 西洋藝術大亂鬥：Canvas Combat

Western Art History Knowledge Fighting RPG。純 HTML、CSS、JavaScript ES Modules 與 Canvas 2D 製作，可直接部署至 GitHub Pages。

## 已完成內容

- 11 個主選單入口：單人、雙人、Boss、藝術試煉、練習、教室、故事、圖鑑、排行榜、設定與存檔管理。
- 25 位藝術家資料與 25 張生成式全身角色圖；缺圖仍有 SVG／Canvas 備援。
- 250 題題庫，簡單、中等、困難各至少 60 題；固定四選一、附解析、選項動態洗牌且同場不重複。
- 真正的本機雙人輪流制，P1／P2 的 HP、能量、Combo、分數、大絕與答題狀態完全獨立。
- 單局與三戰兩勝；第二小局由 P2 先攻，平手時進入輪流驟死題。
- CPU 易／中／難有限狀態流程、策略選招、答題命中率、攻擊預警與反擊階段。
- Boss 具獨立 HP、護盾、70%／35% 轉階段與策略變化；達利與 7 位新增藝術家共有 8 套專屬 Boss 演出。
- 5 連戰藝術試煉、9 章故事線、無限時間練習與教師控制的教室模式。
- 版本化 localStorage 存檔、圖鑑解鎖、排行榜、JSON 匯入／匯出與無效存檔防護。
- Canvas 2D 高 DPI 戰鬥畫面、75 張角色專屬攻擊／大絕／KO 影格、前衝、殘影、粒子、衝擊波、Combo 與 Boss 專屬演出。
- Web Audio 合成音效及各時期循環背景音樂；支援總音量、BGM、SFX、靜音與大絕期間壓低音樂。
- 鍵盤、滑鼠、觸控、行動版與降低閃光／關閉震動設定。

## 操作

- 技能：`Q` 輕攻擊、`W` 重攻擊、`E` 大絕招。
- 作答：數字鍵 `1`～`4`，亦可使用滑鼠或觸控。
- `Enter` 確認或繼續，`Esc` 返回或開啟暫停。
- 瀏覽器第一次互動後才會啟用音訊，符合自動播放限制。

## 本機執行與測試

本專案不需要建置步驟。請以任一靜態網站伺服器開啟根目錄，例如：

```text
npm run serve
```

執行自動測試：

```text
npm test
```

目前共 17 項自動測試，涵蓋 AI、獨立戰鬥狀態、三戰兩勝、題庫、存檔、開場影片、主視覺、75 張戰鬥影格與 Boss 專屬動畫。

## GitHub Pages 部署

1. 將本目錄內容提交並推送到 GitHub repository 的 `main` 分支。
2. 開啟 repository 的 **Settings → Pages**。
3. Source 選擇 **Deploy from a branch**。
4. Branch 選 `main`，資料夾選 `/ (root)`，按 Save。
5. 等待 Pages 提供網址；本專案使用相對路徑，可直接在子路徑運作。

## 主要資料與素材

- `data/artists.js`：25 位藝術家、招式、流派與圖鑑資料。
- `data/questions.js`：250 題三級題庫及驗證器。
- `assets/characters/`：18 張已生成角色全身圖。
- `assets/prompts/artist-image-prompts.json`：完整角色圖提示詞。
- `assets/ASSET_STATUS.md`：素材尺寸、授權與占位狀態。
- `assets/audio/`：音訊清單與生成提示；目前正式運作使用 Web Audio 備援。
- `tests/manual-checklist.md`：實機驗收紀錄。

## 已知限制

- 尚未納入具明確再散布授權的 MP3／OGG 曲目；目前以程式合成的時期主題 BGM 與音效完整備援。
- 目前每位角色具有攻擊、大絕與 KO 獨立影格；更細緻的行走循環與多段受傷逐格動畫仍由 Canvas 位移、翻轉與特效補間。
- 排行榜與進度使用單一瀏覽器的 localStorage，未提供跨裝置雲端同步。
