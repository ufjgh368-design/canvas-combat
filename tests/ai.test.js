import test from 'node:test';import assert from 'node:assert/strict';import { chooseAiMove,chooseAiAnswer,aiAnswersCorrect,thinkingTime } from '../js/ai.js';
const cpu={energy:100,hp:20,combo:4},player={hp:30,energy:0};
test('AI 能量滿時可選大絕',()=>assert.equal(chooseAiMove(cpu,player,'hard',()=>.99).id,'ultimate'));
test('三級命中率確實不同',()=>{assert.equal(aiAnswersCorrect('easy','hard',()=>.5),false);assert.equal(aiAnswersCorrect('hard','hard',()=>.5),true);});
test('思考時間落在集中設定範圍',()=>{assert.equal(thinkingTime('hard',()=>0),700);assert.equal(thinkingTime('hard',()=>1),1800);});
test('AI 作答會選出可顯示的實際選項',()=>{const q={difficulty:'hard',answerIndex:2,options:['A','B','C','D']};assert.deepEqual(chooseAiAnswer(q,'hard',()=>0),{index:2,correct:true});const wrong=chooseAiAnswer(q,'easy',()=>.99);assert.equal(wrong.correct,false);assert.notEqual(wrong.index,q.answerIndex);assert.equal(q.options[wrong.index],'D');});
