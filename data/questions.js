import { ARTISTS } from './artists.js';

const DIFFICULTIES=['easy','medium','hard'];
const labels={easy:'簡單',medium:'中等',hard:'困難'};
export const QUESTION_TYPE_LABELS={memory:'記憶',understanding:'理解',literacy:'素養判讀',judgment:'判斷',context:'文化脈絡',trivia:'藝術趣聞'};
const TRAILING_PARENTHETICAL=/\s*[（(][^（）()]*[）)]\s*$/u;
export const stripQuestionSuffix=text=>String(text||'').replace(TRAILING_PARENTHETICAL,'').trim();
const pickOthers=(field,artist,count=3)=>ARTISTS.filter(a=>a.id!==artist.id).map(a=>a[field]).filter((v,i,x)=>x.indexOf(v)===i&&v!==artist[field]).slice(0,count);
const pad=(arr,fallbacks)=>[...new Set([...arr,...fallbacks])].slice(0,3);

function buildQuestion(artist,n,globalIndex){
  const difficulty=DIFFICULTIES[globalIndex%3];
  const group=Math.floor(n/3),work=artist.representativeWorks[group%artist.representativeWorks.length];
  let question,correct,distractors,category='memory';
  if(difficulty==='easy'){
    if(group===0){category='memory';question=`在${artist.period}脈絡中，《${work}》與哪位藝術家關係最密切？`;correct=artist.nameZh;distractors=pickOthers('nameZh',artist);}
    else if(group===1){category='trivia';question=`藝術家國籍趣聞：創作《${work}》的${artist.nameZh}是哪一國藝術家？`;correct=artist.nationality;distractors=pad(pickOthers('nationality',artist),['德國','比利時','瑞士']);}
    else if(group===2){category='understanding';question=`要理解${artist.nameZh}在藝術史上的位置，應先連結哪個藝術流派？`;correct=artist.artMovement;distractors=pad(pickOthers('artMovement',artist),['洛可可','新古典主義','達達主義']);}
    else{category='trivia';question=`藝術導覽以「${artist.title}」作為趣味線索，指的是哪位藝術家？`;correct=artist.nameZh;distractors=pickOthers('nameZh',artist);}
  } else if(difficulty==='medium'){
    if(group===0){category='understanding';question=`下列何者最能概括${artist.nameZh}的創作特色？`;correct=artist.keyTerms.join('、');distractors=ARTISTS.filter(a=>a.id!==artist.id).slice((n*2)%12,(n*2)%12+3).map(a=>a.keyTerms.join('、'));}
    else if(group===1){category='judgment';question=`若研究「${artist.keyTerms[1]}」，判斷哪位藝術家最適合作為案例？`;correct=artist.nameZh;distractors=pickOthers('nameZh',artist);}
    else if(group===2){category='trivia';question=`藝術年表趣聞：${artist.nameZh}的生卒年代為何？`;correct=`${artist.birthYear}–${artist.deathYear}`;distractors=ARTISTS.filter(a=>a.id!==artist.id).slice(n,n+3).map(a=>`${a.birthYear}–${a.deathYear}`);}
    else{category='literacy';question=`結合「${artist.keyTerms[0]}」的風格線索，《${work}》最接近哪位藝術家？`;correct=artist.nameZh;distractors=pickOthers('nameZh',artist);}
  } else {
    if(group===0){category='context';question=`將${artist.nameZh}置於文化與藝術史脈絡，哪組「時期／流派」配對正確？`;correct=`${artist.period}／${artist.artMovement}`;distractors=[...new Set(ARTISTS.filter(a=>a.id!==artist.id).map(a=>`${a.period}／${a.artMovement}`))].filter(x=>x!==correct).slice(0,3);}
    else if(group===1){category='literacy';question=`運用視覺素養分析，下列哪件作品最適合討論${artist.nameZh}的「${artist.keyTerms[0]}」？`;correct=work;distractors=ARTISTS.filter(a=>a.id!==artist.id).slice((n+3)%14,(n+3)%14+3).map(a=>a.representativeWorks[0]);}
    else if(group===2){category='judgment';question=`比較藝術家年代並判斷，哪一位的出生年是 ${artist.birthYear}？`;correct=artist.nameZh;distractors=pickOthers('nameZh',artist);}
    else{category='context';question=`綜合流派與風格脈絡，哪位藝術家同時符合「${artist.artMovement}」與「${artist.keyTerms[2]}」？`;correct=artist.nameZh;distractors=pickOthers('nameZh',artist);}
  }
  const raw=[correct,...distractors];
  const shift=(globalIndex*7+n)%4;
  const options=raw.map((_,i)=>raw[(i+shift)%4]);
  return {id:`${artist.stageId}-${artist.id}-${difficulty}-${String(n+1).padStart(3,'0')}`,difficulty,period:artist.stageId,artistIds:[artist.id],category,question:stripQuestionSuffix(question),options,answerIndex:options.indexOf(correct),explanation:`答案是「${correct}」。${artist.nameZh}屬於${artist.period}脈絡，以${artist.keyTerms.join('、')}聞名。`,tags:[artist.period,artist.nameZh,labels[difficulty],QUESTION_TYPE_LABELS[category]],sourceLabel:'museum-or-reference'};
}

export const QUESTIONS=ARTISTS.flatMap((a,ai)=>Array.from({length:10},(_,n)=>buildQuestion(a,n,ai*10+n)));

export function validateQuestions(items=QUESTIONS){
  const errors=[], ids=new Set(), texts=new Set();
  for(const q of items){
    if(ids.has(q.id)) errors.push(`duplicate-id:${q.id}`); ids.add(q.id);
    if(texts.has(q.question)) errors.push(`duplicate-question:${q.id}`); texts.add(q.question);
    if(!DIFFICULTIES.includes(q.difficulty)) errors.push(`difficulty:${q.id}`);
    if(!Array.isArray(q.options)||q.options.length!==4||new Set(q.options).size!==4) errors.push(`options:${q.id}`);
    if(!Number.isInteger(q.answerIndex)||q.answerIndex<0||q.answerIndex>3) errors.push(`answer:${q.id}`);
    if(!q.explanation) errors.push(`explanation:${q.id}`);
    if(!QUESTION_TYPE_LABELS[q.category]) errors.push(`category:${q.id}`);
    if(TRAILING_PARENTHETICAL.test(q.question)) errors.push(`trailing-parenthetical:${q.id}`);
  }
  return {valid:errors.length===0,errors,counts:Object.fromEntries(DIFFICULTIES.map(d=>[d,items.filter(q=>q.difficulty===d).length]))};
}

export function shuffledQuestion(q,random=Math.random){
  const entries=q.options.map((text,i)=>({text,correct:i===q.answerIndex}));
  for(let i=entries.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[entries[i],entries[j]]=[entries[j],entries[i]];}
  return {...q,question:stripQuestionSuffix(q.question),options:entries.map(e=>e.text),answerIndex:entries.findIndex(e=>e.correct)};
}
