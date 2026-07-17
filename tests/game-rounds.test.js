import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../js/game.js';
import { createFighter, SessionScope } from '../js/battle-state.js';

function fixture(){
  let continued=false,finished=null;
  const app={roundTransition:(game,winner,loser,next)=>{continued=true;next();},finishBattle:(game,winner)=>{finished=winner;},updateBattle(){},setTurn(){},showSkills(){},alert(){},hideQuestion(){}};
const renderer={},audio={tone(){},startBgm(){},stopBgm(){},duck(){}};
  const game=new Game(app,renderer,audio);
  game.config={mode:'versus',roundsToWin:2};
  game.scope=new SessionScope();
  game.fighters=[createFighter({id:'p1',playerName:'P1',artistId:'bach'}),createFighter({id:'p2',playerName:'P2',artistId:'mozart'})];
  game.beginTurn=()=>{};
  return {game,get continued(){return continued},get finished(){return finished}};
}

test('三戰兩勝會重設數值並由 P2 於第二局先攻',()=>{const f=fixture();f.game.fighters[1].hp=0;f.game.finishRound(f.game.fighters[0]);assert.equal(f.game.fighters[0].roundsWon,1);assert.equal(f.game.round,2);assert.equal(f.game.active,1);assert.equal(f.game.fighters[1].hp,100);assert.equal(f.continued,true);});

test('取得第二勝後才結束系列賽',()=>{const f=fixture();f.game.fighters[0].roundsWon=1;f.game.finishRound(f.game.fighters[0]);assert.equal(f.finished?.id,'p1');});
