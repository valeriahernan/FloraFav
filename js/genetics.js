
export function mutateSpecies(species){
  const mutation={
    ...species,
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
      mutation.petalCount=Math.max(3,Math.min(16,species.petalCount+Math.round(random(-2,2))));
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

  return mutation;
}
