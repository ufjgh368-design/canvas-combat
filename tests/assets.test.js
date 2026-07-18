import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ARTISTS,ARTIST_CATEGORY_GROUPS} from '../data/artists.js';
import {STAGES} from '../data/stages.js';

test('37 位音樂家都有完整圖鑑與三種戰鬥姿勢',()=>{
  assert.equal(ARTISTS.length,37);
  for(const musician of ARTISTS){
    for(const [suffix,min] of [['gallery.png',10000],['battle.webp',5000],['ultimate.webp',5000],['ko.webp',5000]]){
      const path=new URL(`../assets/characters/${musician.id}-${suffix}`,import.meta.url);
      assert.equal(existsSync(path),true,`${musician.id} ${suffix} missing`);
      assert.ok(statSync(path).size>min,`${musician.id} ${suffix} too small`);
    }
    const hashes=['battle','ultimate','ko'].map(frame=>createHash('sha256').update(readFileSync(new URL(`../assets/characters/${musician.id}-${frame}.webp`,import.meta.url))).digest('hex'));
    assert.equal(new Set(hashes).size,3,`${musician.id} poses are duplicated`);
  }
});

test('37 位音樂家依四大音樂史類別完整排列',()=>{
  assert.deepEqual(ARTIST_CATEGORY_GROUPS.map(group=>group.label),['巴洛克','古典與過渡','浪漫與民族樂派','現代與跨界']);
  const groupedIds=ARTIST_CATEGORY_GROUPS.flatMap(group=>group.artistIds);
  assert.equal(groupedIds.length,37);
  assert.equal(new Set(groupedIds).size,37);
  assert.deepEqual(ARTISTS.map(musician=>musician.id),groupedIds);
});

test('大師角色具三樂章名稱與專屬演出',()=>{
  const bosses=ARTISTS.filter(musician=>musician.bossVariant);
  assert.ok(bosses.length>=7);
  for(const musician of bosses){
    assert.equal(musician.bossVariant.phaseNames.length,3);
    assert.ok(musician.bossVariant.animation);
  }
});

test('新社群封面與音樂家入口已接入',()=>{
  const og=new URL('../public/og.png',import.meta.url);
  assert.ok(statSync(og).size>500000);
  const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const main=readFileSync(new URL('../js/main.js',import.meta.url),'utf8');
  assert.match(index,/西洋音樂家/);
  assert.match(index,/MAESTRO[\s\S]*COMBAT/);
  assert.match(main,/p1:'bach',p2:'mozart'/);
  assert.doesNotMatch(main,/INTRO_VIDEO_ID='ggVejS6dfq0'/);
});

test('進入音樂殿堂會播放指定影片並可結束或略過',()=>{
  const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const main=readFileSync(new URL('../js/main.js',import.meta.url),'utf8');
  assert.match(index,/id="introVideo"/);
  assert.match(index,/id="skipVideo"/);
  assert.match(main,/videoId:'ZOabJpM7yIw'/);
  assert.match(main,/YT\.PlayerState\.ENDED/);
  assert.match(main,/onError:[\s\S]*影片目前無法嵌入播放/);
});

test('四個音樂時期都有專屬舞台背景圖',()=>{
  assert.deepEqual(Object.keys(STAGES),['baroque','classical','romantic','modern']);
  for(const [stageId,stage] of Object.entries(STAGES)){
    assert.equal(stage.image,`assets/stages/${stageId}.webp`);
    const path=new URL(`../${stage.image}`,import.meta.url);
    assert.equal(existsSync(path),true,`${stageId} stage missing`);
    assert.ok(statSync(path).size>200000,`${stageId} stage too small`);
  }
  const renderer=readFileSync(new URL('../js/effects.js',import.meta.url),'utf8');
  assert.match(renderer,/this\.background = this\.loadImage/);
});
