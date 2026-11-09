
export function mutateSpecies(species){
  const mutation={
    ...species,
    rules:{...species.rules},
    stem:[...species.stem],
    flower:[...species.flower]
  };

  const random=(min,max)=>Math.random()*(max-min)+min;
  const choice=Math.floor(Math.random()*7);

  switch(choice){
    case 0:
      mutation.angle=Math.max(10,Math.min(60,species.angle+random(-8,8)));
      break;

    case 1:
      mutation.length=Math.max(20,species.length*random(.8,1.2));
      break;

    case 2:
      mutation.leafSize=Math.max(8,species.leafSize*random(.75,1.3));
      break;

    case 3:
      mutation.flowerSize=Math.max(10,species.flowerSize*random(.75,1.3));
      break;

    case 4:
      mutation.petalCount=Math.max(3,Math.min(16,
        species.petalCount+Math.round(random(-2,2))
      ));
      break;

    case 5:{
      const channel=Math.floor(Math.random()*3);
      mutation.flower[channel]=Math.floor(random(40,256));
      break;
    }

    case 6:{
      const channel=Math.floor(Math.random()*3);
      mutation.stem[channel]=Math.floor(random(30,180));
      break;
    }
  }

  mutation.mutationLevel="Mutación";
  return mutation;
}

export function hybridizeSpecies(parentA,parentB){
  const choose=(a,b)=>Math.random()<.5?a:b;

  const blendColor=(a,b)=>a.map((value,i)=>
    Math.max(0,Math.min(255,
      Math.round((value+b[i])/2+(Math.random()-.5)*30)
    ))
  );

  const average=(a,b)=>Math.round((a+b)/2);

  return {
    name:parentA.name+" × "+parentB.name,
    axiom:"X",

    rules:{
      X:choose(parentA.rules.X,parentB.rules.X),
      F:choose(parentA.rules.F??"FF",parentB.rules.F??"FF")
    },

    angle:average(parentA.angle,parentB.angle),
    stem:blendColor(parentA.stem,parentB.stem),
    flower:blendColor(parentA.flower,parentB.flower),
    length:average(parentA.length,parentB.length),

    leafType:choose(parentA.leafType,parentB.leafType),
    leafSize:average(parentA.leafSize,parentB.leafSize),

    flowerType:choose(parentA.flowerType,parentB.flowerType),
    flowerSize:average(parentA.flowerSize,parentB.flowerSize),
    petalCount:average(parentA.petalCount,parentB.petalCount),

    hybrid:true,
    mutationLevel:"Híbrido"
  };
}
