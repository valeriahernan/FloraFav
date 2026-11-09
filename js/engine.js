
export function generateLSystem(species,days){
  const day=Math.max(1,Math.min(100,Math.floor(Number(days)||1)));

  // Control progresivo del crecimiento
  const iterations=day<=3
    ?3
    :Math.min(4,3+Math.floor((day-3)/49));

  const maxLength=60000;
  let sentence=species.axiom;

  for(let i=0;i<iterations-1;i++){
    let next="";

    for(const char of sentence){
      next+=species.rules[char]??char;

      if(next.length>maxLength){
        throw new Error("Growth limit reached");
      }
    }

    sentence=next;
  }

  return sentence;
}
