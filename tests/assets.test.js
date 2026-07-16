import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { ARTISTS } from '../data/artists.js';

test('25 位藝術家都有可用圖鑑角色圖',()=>{
  assert.equal(ARTISTS.length,25);
  for(const artist of ARTISTS){
    const path=new URL(`../assets/characters/${artist.id}-gallery.png`,import.meta.url);
    assert.equal(existsSync(path),true,`${artist.id} missing`);
    assert.ok(statSync(path).size>100000,`${artist.id} image too small`);
  }
});

test('25 位藝術家各有攻擊、大絕與 KO 獨立影格',()=>{
  for(const artist of ARTISTS){
    for(const frame of ['battle','ultimate','ko']){
      const path=new URL(`../assets/characters/${artist.id}-${frame}.webp`,import.meta.url);
      assert.equal(existsSync(path),true,`${artist.id} ${frame} missing`);
      assert.ok(statSync(path).size>10000,`${artist.id} ${frame} too small`);
    }
  }
});

test('主視覺背景已建立',()=>{
  const path=new URL('../assets/ui/main-visual-background.png',import.meta.url);
  assert.equal(existsSync(path),true);
  assert.ok(statSync(path).size>500000);
});
