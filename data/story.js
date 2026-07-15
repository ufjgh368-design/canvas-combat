export const STORY_CHAPTERS=[
 ['文藝復興','renaissance',['leonardo','michelangelo','raphael']],['巴洛克','baroque',['caravaggio','rembrandt']],['洛可可與新古典','baroque',['goya']],['浪漫主義與寫實主義','romantic',['goya','turner']],['印象派','impressionist',['monet','degas']],['後印象派','postimpressionist',['vangogh','cezanne']],['現代藝術','modern',['klimt']],['立體派、抽象與超現實','abstract',['picasso','kandinsky','dali','frida']],['當代及普普藝術','pop',['warhol']]
].map((c,i)=>({id:i+1,title:c[0],stageId:c[1],artistIds:c[2],intro:`第 ${i+1} 章：走進${c[0]}的時代背景與視覺革命。`,summary:'完成戰鬥後，以關鍵詞回顧時代、技法與代表作品。'}));
