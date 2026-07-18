import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS,QUESTION_TYPE_LABELS,shuffledQuestion,stripQuestionSuffix } from '../data/questions.js';

test('題庫涵蓋六種認知與文化題型',()=>{
  const counts=Object.fromEntries(Object.keys(QUESTION_TYPE_LABELS).map(type=>[
    type,
    QUESTIONS.filter(question=>question.category===type).length,
  ]));
  assert.deepEqual(Object.keys(counts).sort(),Object.keys(QUESTION_TYPE_LABELS).sort());
  assert.ok(Object.values(counts).every(count=>count>=30),JSON.stringify(counts));
});

test('戰鬥題目不顯示尾端括號標籤',()=>{
  const suffix=/\s*[（(][^（）()]*[）)]\s*$/u;
  assert.ok(QUESTIONS.every(question=>!suffix.test(question.question)));
  assert.equal(stripQuestionSuffix('《星夜》的作者是誰？（題組：夜空詩人）'),'《星夜》的作者是誰？');
  const shuffled=shuffledQuestion({...QUESTIONS[0],question:'測試題目（舊版題組）'},()=>0.25);
  assert.equal(shuffled.question,'測試題目');
});
