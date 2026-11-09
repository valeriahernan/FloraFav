
export function generateLSystem(species,days){
  const day=Math.max(1,Math.min(100,Number(days)||1));

  // Crecimiento gradual entre iteraciones
  const progress=(day-1)/99;
  const iterations=2+progress*3;
  const whole=Math.floor(iterations);
  const fraction=iterations-whole;

  let sentence=species.axiom;
  const maxLength=100000;

  for(let i=0;i<whole;i++){
    let next="";

    for(const char of sentence){
      next+=species.rules[char]??char;
      if(next.length>maxLength)break;
    }

    sentence=next;
    if(sentence.length>maxLength)break;
  }

  // Desarrollo gradual de la siguiente etapa
  if(fraction>0 && whole<5){
    const next=sentence.replace(
      /[X]/g,
      match=>Math.random()<fraction
        ? species.rules[match]??match
        : match
    );

    sentence=next;
  }

  return sentence;
}
