import { ARTISTS } from './artists.js';

const DIFFICULTIES=['easy','medium','hard'];
const labels={easy:'簡單',medium:'中等',hard:'困難'};
const TYPE_BY_INDEX=['記憶','記憶','理解','文化脈絡','判斷','素養應用','文化脈絡','理解','趣聞','素養應用'];
const DIFFICULTY_BY_INDEX=['easy','easy','medium','medium','hard','hard','medium','medium','easy','hard'];
const distinct=values=>[...new Set(values)];
const peers=(artist,offset=0)=>{
  const pool=ARTISTS.filter(item=>item.id!==artist.id);
  return Array.from({length:pool.length},(_,index)=>pool[(index+offset)%pool.length]);
};
const choices=(correct,candidates,fallbacks=[])=>distinct([correct,...candidates,...fallbacks]).slice(0,4);

function buildQuestion(artist,n,globalIndex){
  const difficulty=DIFFICULTY_BY_INDEX[n];
  const questionType=TYPE_BY_INDEX[n];
  const other=peers(artist,(globalIndex*3+n)%Math.max(1,ARTISTS.length-1));
  const work=artist.representativeWorks[n%artist.representativeWorks.length];
  let question,correct,candidates,explanation;

  switch(n){
    case 0:
      question=`【記憶】《${work}》最主要與哪位音樂家相關？`;
      correct=artist.nameZh;
      candidates=other.map(item=>item.nameZh);
      explanation=`《${work}》是${artist.nameZh}的代表作品之一。`;
      break;
    case 1:
      question=`【記憶】${artist.nameZh}的國籍是哪一國？`;
      correct=artist.nationality;
      candidates=other.map(item=>item.nationality);
      explanation=`${artist.nameZh}是${artist.nationality}音樂家，活躍於${artist.period}。`;
      break;
    case 2:
      question=`【理解】聽到「${artist.keyTerms[0]}、${artist.keyTerms[1]}」兩項線索，最應聯想到哪位音樂家？`;
      correct=artist.nameZh;
      candidates=other.map(item=>item.nameZh);
      explanation=`${artist.keyTerms[0]}與${artist.keyTerms[1]}都是理解${artist.nameZh}音樂語言的重要線索。`;
      break;
    case 3:
      question=`【文化脈絡】若把${artist.nameZh}放回西洋音樂史，哪組「時期／流派」最恰當？`;
      correct=`${artist.period}／${artist.artMovement}`;
      candidates=other.map(item=>`${item.period}／${item.artMovement}`);
      explanation=`${artist.nameZh}位於${artist.period}脈絡，通常歸入${artist.artMovement}。`;
      break;
    case 4:
      question=`【判斷】關於${artist.nameZh}，下列哪一項敘述正確？`;
      correct=`以${artist.keyTerms[0]}著稱，代表作包括《${artist.representativeWorks[0]}》`;
      candidates=other.map(item=>`以${item.keyTerms[0]}著稱，代表作包括《${item.representativeWorks[0]}》`);
      explanation=`${artist.keyTerms[0]}與《${artist.representativeWorks[0]}》都能正確指向${artist.nameZh}。`;
      break;
    case 5:
      question=`【素養應用】策展人要規劃「${artist.keyTerms[2]}」主題聆聽會，下列哪部作品最適合作為${artist.nameZh}的示例？`;
      correct=work;
      candidates=other.map(item=>item.representativeWorks[(n+1)%item.representativeWorks.length]);
      explanation=`《${work}》可放進${artist.nameZh}的創作脈絡，並用來討論${artist.keyTerms[2]}。`;
      break;
    case 6:
      question=`【文化脈絡】想判斷${artist.nameZh}與重大音樂風格變遷的先後關係，應採用哪組生卒年？`;
      correct=`${artist.birthYear}–${artist.deathYear}`;
      candidates=other.map(item=>`${item.birthYear}–${item.deathYear}`);
      explanation=`${artist.nameZh}生於${artist.birthYear}年、卒於${artist.deathYear}年，這有助於建立時代先後。`;
      break;
    case 7:
      question=`【理解】為何《${work}》適合納入${artist.nameZh}的學習單？`;
      correct=`它能連結${artist.artMovement}與${artist.keyTerms[1]}`;
      candidates=other.map(item=>`它主要用來連結${item.artMovement}與${item.keyTerms[1]}`);
      explanation=`作品、流派與技法必須互相對應；本題正確連結為${artist.artMovement}與${artist.keyTerms[1]}。`;
      break;
    case 8:
      question=`【趣聞】遊戲稱號「${artist.title}」暗示的是哪位音樂家？`;
      correct=artist.nameZh;
      candidates=other.map(item=>item.nameZh);
      explanation=`稱號把${artist.nameZh}的代表性形象濃縮成「${artist.title}」，方便記住其音樂史位置。`;
      break;
    default:
      question=`【素養判斷】一段節目單同時寫著「${artist.artMovement}、${artist.keyTerms[0]}、《${artist.representativeWorks[1]}》」，最合理的主角是誰？`;
      correct=artist.nameZh;
      candidates=other.map(item=>item.nameZh);
      explanation=`流派、技法與作品三項證據一致指向${artist.nameZh}；這比只靠單一關鍵字更可靠。`;
  }

  const raw=choices(correct,candidates,['巴洛克早期／歌劇與牧歌','二十世紀／極簡主義','法國','義大利']);
  const shift=(globalIndex*7+n)%4;
  const options=raw.map((_,index)=>raw[(index+shift)%4]);
  return {
    id:`${artist.stageId}-${artist.id}-${difficulty}-${String(n+1).padStart(3,'0')}`,
    difficulty,
    period:artist.stageId,
    artistIds:[artist.id],
    category:questionType,
    questionType,
    question:`${question}（題組：${artist.nameZh}）`,
    options,
    answerIndex:options.indexOf(correct),
    explanation:`答案是「${correct}」。${explanation}`,
    tags:[artist.period,artist.nameZh,labels[difficulty],questionType],
    sourceLabel:'composer-reference',
  };
}

export const QUESTIONS=ARTISTS.flatMap((artist,artistIndex)=>
  Array.from({length:10},(_,questionIndex)=>buildQuestion(artist,questionIndex,artistIndex*10+questionIndex))
);

export function validateQuestions(items=QUESTIONS){
  const errors=[],ids=new Set(),texts=new Set();
  for(const q of items){
    if(ids.has(q.id)) errors.push(`duplicate-id:${q.id}`); ids.add(q.id);
    if(texts.has(q.question)) errors.push(`duplicate-question:${q.id}`); texts.add(q.question);
    if(!DIFFICULTIES.includes(q.difficulty)) errors.push(`difficulty:${q.id}`);
    if(!TYPE_BY_INDEX.includes(q.questionType)) errors.push(`question-type:${q.id}`);
    if(!Array.isArray(q.options)||q.options.length!==4||new Set(q.options).size!==4) errors.push(`options:${q.id}`);
    if(!Number.isInteger(q.answerIndex)||q.answerIndex<0||q.answerIndex>3) errors.push(`answer:${q.id}`);
    if(!q.explanation) errors.push(`explanation:${q.id}`);
  }
  return {
    valid:errors.length===0,
    errors,
    counts:Object.fromEntries(DIFFICULTIES.map(level=>[level,items.filter(q=>q.difficulty===level).length])),
    typeCounts:Object.fromEntries(distinct(TYPE_BY_INDEX).map(type=>[type,items.filter(q=>q.questionType===type).length])),
  };
}

export function shuffledQuestion(q,random=Math.random){
  const entries=q.options.map((text,index)=>({text,correct:index===q.answerIndex}));
  for(let i=entries.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[entries[i],entries[j]]=[entries[j],entries[i]];}
  return {...q,options:entries.map(entry=>entry.text),answerIndex:entries.findIndex(entry=>entry.correct)};
}
