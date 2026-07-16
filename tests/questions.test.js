import test from 'node:test';import assert from 'node:assert/strict';import { QUESTIONS,validateQuestions,shuffledQuestion } from '../data/questions.js';
test('每位藝術家有 10 題且三級各至少 60 題',()=>{const r=validateQuestions();assert.equal(QUESTIONS.length,250);assert.ok(Object.values(r.counts).every(count=>count>=60));assert.equal(r.valid,true,r.errors.join('\n'));});
test('洗牌後仍保留正確答案',()=>{const q=QUESTIONS[0],answer=q.options[q.answerIndex],s=shuffledQuestion(q,()=>.23);assert.equal(s.options[s.answerIndex],answer);});
