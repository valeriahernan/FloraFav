
export function mutateSpecies(species){
  const mutation={
    ...species,
    stem:[...species.stem],
    flower:[...species.flower],
    angle:Math.max(10,Math.min(60,species.angle+(Math.random()-.5)*12)),
    length:Math.max(20,species.length*(.8+Math.random()*.4))
  };
  const channel=Math.floor(Math.random()*3);
  mutation.flower[channel]=Math.floor(
    Math.random()*256
  );
  return mutation;
}
