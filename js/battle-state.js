export const MOVES={light:{id:'light',label:'輕攻擊',damage:8,difficulty:'easy',defenseEnergy:5,key:'Q'},heavy:{id:'heavy',label:'重攻擊',damage:16,difficulty:'medium',defenseEnergy:8,key:'W'},ultimate:{id:'ultimate',label:'大絕招',damage:32,difficulty:'hard',defenseEnergy:12,key:'E',cost:100}};

export function createFighter({id,type='human',playerName,artistId,maxHp=100}){
  return {id,type,playerName,artistId,hp:maxHp,maxHp,energy:0,maxEnergy:100,combo:0,maxCombo:0,score:0,correctCount:0,wrongCount:0,timeoutCount:0,damageDealt:0,damageReceived:0,currentSkill:null,ultimateUnlocked:false,statusEffects:[],roundsWon:0,isActiveTurn:false,answerHistory:[]};
}
export function comboMultiplier(combo){return 1+Math.min(Math.max(combo-1,0)*.05,.2);}
export function resolveAnswer({attacker,defender,move,correct,timedOut=false,difficulty='easy',remainingSeconds=0}){
  if(!attacker||!defender||!move) throw new Error('Invalid combat resolution');
  if(move.id==='ultimate'&&attacker.energy<100) return {applied:false,reason:'energy'};
  if(!correct){attacker.combo=0; timedOut?attacker.timeoutCount++:attacker.wrongCount++; if(timedOut)attacker.score=Math.max(0,attacker.score-25); attacker.answerHistory.push({correct:false,timedOut,move:move.id}); return {applied:true,hit:false,damage:0};}
  attacker.correctCount++; attacker.combo=Math.min(attacker.combo+1,5); attacker.maxCombo=Math.max(attacker.maxCombo,attacker.combo);
  let damage=Math.round(move.damage*comboMultiplier(attacker.combo)),shieldBlocked=0;
  const shield=defender.statusEffects.find(e=>e.id==='shield'&&e.value>0);
  if(shield){shieldBlocked=Math.min(shield.value,damage);shield.value-=shieldBlocked;damage-=shieldBlocked;}
  defender.hp=Math.max(0,defender.hp-damage); attacker.damageDealt+=damage; defender.damageReceived+=damage;
  const gain={easy:18,medium:24,hard:32}[difficulty]||18;
  if(move.id==='ultimate') attacker.energy=0; else attacker.energy=Math.min(100,attacker.energy+gain);
  defender.energy=Math.min(100,defender.energy+move.defenseEnergy);
  attacker.ultimateUnlocked=attacker.energy>=100; defender.ultimateUnlocked=defender.energy>=100;
  const base={easy:100,medium:200,hard:350}[difficulty]||100;
  const speedBonus=Math.max(0,Math.round(remainingSeconds*5)),comboBonus=(attacker.combo-1)*40,damageBonus=damage*3,remainingHpBonus=Math.round(attacker.hp*.25);
  attacker.score+=base+speedBonus+comboBonus+damageBonus+remainingHpBonus;
  attacker.answerHistory.push({correct:true,timedOut:false,move:move.id,damage});
  return {applied:true,hit:true,damage,shieldBlocked,energyGain:gain,scoreGain:base+speedBonus+comboBonus+damageBonus+remainingHpBonus};
}
export function decideWinner(a,b){if(a.hp!==b.hp)return a.hp>b.hp?a:b;if(a.score!==b.score)return a.score>b.score?a:b;return null;}

export class SessionScope{
  constructor(){this.cancelled=false;this.handles=new Set();this.token=crypto.randomUUID?.()||String(Date.now());}
  delay(ms){return new Promise(resolve=>{if(this.cancelled)return resolve(false);const h=setTimeout(()=>{this.handles.delete(h);resolve(!this.cancelled)},ms);this.handles.add(h);});}
  cancel(){this.cancelled=true;this.handles.forEach(clearTimeout);this.handles.clear();}
}
