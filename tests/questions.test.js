import test from 'node:test';import assert from 'node:assert/strict';import { QUESTIONS,validateQuestions,shuffledQuestion } from '../data/questions.js';
import { ARTIST_MAP } from '../data/artists.js';
test('question text does not expose internal question-group labels',()=>{assert.equal(QUESTIONS.some(item=>item.question.includes('\u984c\u7d44')),false);});
test('questions never reveal a musician-name answer in the prompt',()=>{for(const q of QUESTIONS){const answer=q.options[q.answerIndex],artist=ARTIST_MAP[q.artistIds[0]];if(answer===artist?.nameZh)assert.equal(q.question.includes(answer),false,q.id);}});
test('question prompts have no trailing parenthetical labels',()=>{const trailing=/(?:（[^（）]*）|\([^()]*\))(?=[？?!！。]?$)/;assert.equal(QUESTIONS.some(q=>trailing.test(q.question)),false);});
test('每位音樂家有 10 題且三級各至少 60 題',()=>{const r=validateQuestions();assert.equal(QUESTIONS.length,370);assert.ok(Object.values(r.counts).every(count=>count>=60));assert.equal(r.valid,true,r.errors.join('\n'));});
test('370 題涵蓋記憶、理解、素養、判斷、文化脈絡與趣聞',()=>{const r=validateQuestions();for(const type of ['記憶','理解','素養應用','判斷','文化脈絡','趣聞'])assert.ok(r.typeCounts[type]>=37,`${type}:${r.typeCounts[type]}`);});
test('洗牌後仍保留正確答案',()=>{const q=QUESTIONS[0],answer=q.options[q.answerIndex],s=shuffledQuestion(q,()=>.23);assert.equal(s.options[s.answerIndex],answer);});
