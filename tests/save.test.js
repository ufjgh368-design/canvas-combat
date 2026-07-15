import test from 'node:test';import assert from 'node:assert/strict';import { defaultSave,validateSave,importSave,writeSave,loadSave,SAVE_KEY } from '../js/save.js';
test('預設存檔有效並可往返',()=>{const mem=new Map(),storage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)};const s=defaultSave();assert.equal(validateSave(s),true);writeSave(s,storage);assert.equal(loadSave(storage).version,1);assert.ok(mem.has(SAVE_KEY));});
test('拒絕無效匯入',()=>assert.throws(()=>importSave('{"hello":1}')));
