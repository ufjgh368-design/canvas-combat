import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const gameSource=readFileSync(new URL('../js/game.js',import.meta.url),'utf8');
const uiSource=readFileSync(new URL('../js/main.js',import.meta.url),'utf8');

test('CPU 回合依序顯示題目、選擇與判定後才攻擊',()=>{
  const start=gameSource.indexOf('async cpuTurn()');
  const end=gameSource.indexOf('async checkBossPhase()',start);
  const flow=gameSource.slice(start,end);
  const stages=['showCpuQuestion','showCpuSelection','showCpuFeedback','playAttack'];
  const positions=stages.map(stage=>flow.indexOf(stage));
  assert.ok(positions.every(position=>position>=0));
  assert.deepEqual([...positions].sort((a,b)=>a-b),positions);
  assert.match(flow,/shuffledQuestion\(source\)/);
  assert.match(flow,/scope\.delay\(650\)/);
  assert.match(flow,/scope\.delay\(750\)/);
});

test('CPU 題目四個選項可見但不可由玩家操作',()=>{
  assert.match(uiSource,/showCpuQuestion\(q,cpuName='CPU'\)/);
  assert.match(uiSource,/data-answer="\$\{i\}" disabled aria-disabled="true"/);
  assert.match(uiSource,/正確答案是第/);
});
