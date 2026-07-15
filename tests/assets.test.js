import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { ARTISTS } from '../data/artists.js';

test('18 位藝術家都有可用圖鑑角色圖',()=>{
  for(const artist of ARTISTS){
    const path=new URL(`../assets/characters/${artist.id}-gallery.png`,import.meta.url);
    assert.equal(existsSync(path),true,`${artist.id} missing`);
    assert.ok(statSync(path).size>100000,`${artist.id} image too small`);
  }
});
