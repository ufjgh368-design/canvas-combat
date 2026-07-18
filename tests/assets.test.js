import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ARTISTS,ARTIST_CATEGORY_GROUPS } from '../data/artists.js';
import { STAGES,STAGE_BACKGROUNDS } from '../data/stages.js';

test('四大藝術史分類使用四張獨立舞台背景',()=>{
  assert.equal(new Set(Object.values(STAGE_BACKGROUNDS)).size,4);
  assert.equal(STAGES.renaissance.background,STAGE_BACKGROUNDS.renaissance);
  for(const id of ['baroque','dutch','romantic'])assert.equal(STAGES[id].background,STAGE_BACKGROUNDS.baroqueRomantic);
  for(const id of ['impressionist','postimpressionist'])assert.equal(STAGES[id].background,STAGE_BACKGROUNDS.impressionPost);
  for(const id of ['modern','abstract','surreal','pop'])assert.equal(STAGES[id].background,STAGE_BACKGROUNDS.modernRevolution);
  for(const relative of Object.values(STAGE_BACKGROUNDS)){
    const path=new URL(`../${relative}`,import.meta.url);
    assert.equal(existsSync(path),true,`${relative} missing`);
    assert.ok(statSync(path).size>200000,`${relative} too small`);
  }
});

test('34 位藝術家都有可用圖鑑角色圖',()=>{
  assert.equal(ARTISTS.length,34);
  for(const artist of ARTISTS){
    const path=new URL(`../assets/characters/${artist.id}-gallery.png`,import.meta.url);
    assert.equal(existsSync(path),true,`${artist.id} missing`);
    assert.ok(statSync(path).size>100000,`${artist.id} image too small`);
  }
});

test('34 位藝術家各有攻擊、大絕與 KO 獨立影格',()=>{
  for(const artist of ARTISTS){
    for(const frame of ['battle','ultimate','ko']){
      const path=new URL(`../assets/characters/${artist.id}-${frame}.webp`,import.meta.url);
      assert.equal(existsSync(path),true,`${artist.id} ${frame} missing`);
      assert.ok(statSync(path).size>10000,`${artist.id} ${frame} too small`);
    }
  }
});

test('34 位藝術家依四大藝術史類別完整排列',()=>{
  assert.deepEqual(ARTIST_CATEGORY_GROUPS.map(group=>group.label),['文藝復興','巴洛克與浪漫','印象與後印象','現代藝術革命']);
  const groupedIds=ARTIST_CATEGORY_GROUPS.flatMap(group=>group.artistIds);
  assert.equal(groupedIds.length,34);
  assert.equal(new Set(groupedIds).size,34);
  assert.deepEqual(ARTISTS.map(artist=>artist.id),groupedIds);
});

test('新增藝術家具有真正不同的三姿勢影格與 Boss 專屬動畫',()=>{
  const ids=['botticelli','titian','renoir','gauguin','munch','matisse','pollock'];
  for(const id of ids){
    const artist=ARTISTS.find(item=>item.id===id);
    assert.ok(artist?.bossVariant?.animation,`${id} boss animation missing`);
    assert.equal(artist.bossVariant.phaseNames.length,3,`${id} boss phase names missing`);
    const hashes=['battle','ultimate','ko'].map(frame=>{
      const path=new URL(`../assets/characters/${id}-${frame}.webp`,import.meta.url);
      return createHash('sha256').update(readFileSync(path)).digest('hex');
    });
    assert.equal(new Set(hashes).size,3,`${id} frames are duplicated`);
  }
});

test('主選單與戰鬥背景已建立，並與進場封面分離',()=>{
  const path=new URL('../assets/ui/main-visual-background.png',import.meta.url);
  const ogPath=new URL('../public/og.png',import.meta.url);
  assert.equal(existsSync(path),true);
  assert.ok(statSync(path).size>500000);
  assert.notEqual(
    createHash('sha256').update(readFileSync(path)).digest('hex'),
    createHash('sha256').update(readFileSync(ogPath)).digest('hex'),
    '主選單／戰鬥背景不應覆蓋進場封面 public/og.png',
  );
});

test('進入展廳會播放指定影片並提供結束與略過流程',()=>{
  const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const main=readFileSync(new URL('../js/main.js',import.meta.url),'utf8');
  const homepage=readFileSync(new URL('../homepage.css',import.meta.url),'utf8');
  assert.match(index,/id="introVideoPlayer"/);
  assert.match(index,/id="skipVideo"/);
  assert.match(main,/INTRO_VIDEO_ID='ggVejS6dfq0'/);
  assert.match(main,/PlayerState\.ENDED/);
  assert.match(main,/onError:\(\)=>this\.finishIntroVideo\(\)/);
  assert.match(homepage,/\.intro-video[\s\S]*url\('public\/og\.png'\)/);
});
