
export function generateLSystem(species,iterations){
  let sentence=species.axiom;
  const maxLength=150000;
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
