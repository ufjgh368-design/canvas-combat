import { AI_DIFFICULTY_CONFIG } from '../data/modes.js';
import { MOVES } from './battle-state.js';
export const AI_STATES=['idle','thinking','selectingSkill','answering','preparingAttack','attacking','countering','recovering','endTurn'];
export function chooseAiMove(cpu,player,difficulty='medium',random=Math.random){
  const cfg=AI_DIFFICULTY_CONFIG[difficulty];
  const weights={light:.45,heavy:.45,ultimate:0};
  if(cpu.energy>=100)weights.ultimate=.1+cfg.ultimateUsage*.5;
  if(cpu.energy>=100&&player.hp<=40)weights.ultimate+=.45;
  if(cpu.hp<=25){weights.heavy+=.2;if(cpu.energy>=100)weights.ultimate+=.25;}
  if(cpu.combo>=3)weights.heavy+=.15;
  if(player.hp<=16)weights.heavy+=.2;
  const pool=Object.entries(weights).filter(([id])=>id!=='ultimate'||cpu.energy>=100);const total=pool.reduce((s,[,w])=>s+w,0);let roll=random()*total;
  for(const [id,w] of pool){roll-=w;if(roll<=0)return MOVES[id];}return MOVES.light;
}
export function aiAnswersCorrect(difficulty,questionDifficulty,random=Math.random){return random()<AI_DIFFICULTY_CONFIG[difficulty].accuracy[questionDifficulty];}
export function aiCounterSucceeds(difficulty,random=Math.random){return random()<AI_DIFFICULTY_CONFIG[difficulty].counterChance;}
export function thinkingTime(difficulty,random=Math.random){const [a,b]=AI_DIFFICULTY_CONFIG[difficulty].cpuThinkingTime;return Math.round(a+random()*(b-a));}
