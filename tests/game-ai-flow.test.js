import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../js/game.js';
import { createFighter } from '../js/battle-state.js';

test('AI 回合會依序顯示題目、思考、選答與結果',async()=>{
  const events=[];
  const app={
    hideQuestion:()=>events.push('hide'),
    setCpuState:text=>events.push(`state:${text}`),
    showCpuQuestion:q=>events.push(`question:${q.id}`),
    revealCpuAnswer:(q,index,correct)=>events.push(`answer:${index}:${correct}`),
    alert:()=>events.push('alert'),
  };
  const game=new Game(app,{}, {tone:()=>{}});
  game.config={mode:'single',difficulty:'medium'};
  game.fighters=[
    createFighter({id:'p1',playerName:'玩家',artistId:'bach'}),
    createFighter({id:'cpu',type:'cpu',playerName:'AI',artistId:'mozart'}),
  ];
  game.used=new Set();
  game.scope={cancelled:false,delay:async()=>true};
  game.playAttack=async()=>events.push('attack');
  game.nextTurn=()=>events.push('next');

  await game.cpuTurn();

  const questionIndex=events.findIndex(event=>event.startsWith('question:'));
  const analysisIndex=events.findIndex(event=>event.includes('分析四個選項'));
  const choiceIndex=events.findIndex(event=>event.includes('選擇第'));
  const answerIndex=events.findIndex(event=>event.startsWith('answer:'));
  assert.ok(questionIndex>=0);
  assert.ok(questionIndex<analysisIndex);
  assert.ok(analysisIndex<choiceIndex);
  assert.ok(choiceIndex<answerIndex);
  assert.equal(events.at(-1),'next');
});
