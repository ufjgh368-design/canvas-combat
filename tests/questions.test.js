import test from 'node:test';import assert from 'node:assert/strict';import { QUESTIONS,validateQuestions,shuffledQuestion } from '../data/questions.js';
test('題庫為 180 題且三級各 60 題',()=>{const r=validateQuestions();assert.equal(QUESTIONS.length,180);assert.deepEqual(r.counts,{easy:60,medium:60,hard:60});assert.equal(r.valid,true,r.errors.join('\n'));});
test('洗牌後仍保留正確答案',()=>{const q=QUESTIONS[0],answer=q.options[q.answerIndex],s=shuffledQuestion(q,()=>.23);assert.equal(s.options[s.answerIndex],answer);});
