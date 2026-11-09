
function rewrite(sentence,species,fraction=1){
  const total=[...sentence].filter(char=>char==="X").length;
  const target=Math.floor(total*fraction);
  let accumulator=0;

  let result="";

  for(const char of sentence){
    if(char==="X"){
      accumulator+=target;

      if(accumulator>=total && total>0){
        result+=species.rules.X;
        accumulator-=total;
      }else{
        result+="X";
      }
    }else{
      result+=char;
    }
  }

  return result;
}

export function generateLSystem(species,days){
  const day=Math.max(1,Math.min(100,Number(days)||1));

  // Entre 1 y 4 niveles de desarrollo
  const growth=1+((day-1)/99)*3;
  const whole=Math.floor(growth);
  const fraction=growth-whole;

  let sentence=species.axiom;

  for(let i=0;i<whole;i++){
    sentence=rewrite(sentence,species,1);
  }

  if(fraction>0){
    sentence=rewrite(sentence,species,fraction);
  }

  return sentence;
}
