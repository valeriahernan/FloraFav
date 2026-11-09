
export function generateLSystem(species,days){
  const day=Math.max(1,Math.min(100,Math.floor(Number(days)||1)));

  // Los 100 días se distribuyen en 4 etapas de crecimiento.
  // Así evitamos ejecutar 99 iteraciones y saturar el navegador.
  const iterations=3+Math.floor(Math.max(0,day-3)*3/97);

  const maxLength=150000;
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
