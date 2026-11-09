// Función auxiliar para limitar valores fácilmente
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const randomRange = (min, max) => Math.random() * (max - min) + min;

export function mutateSpecies(species) {
  // Clonado profundo simple para evitar mutar el objeto original por referencia
  const mutation = JSON.parse(JSON.stringify(species));
  
  const choice = Math.floor(Math.random() * 7);

  switch (choice) {
    case 0: // Ángulo
      mutation.angle = clamp(mutation.angle + randomRange(-8, 8), 10, 60);
      break;
    case 1: // Longitud (Añadido límite máximo de 200)
      mutation.length = clamp(species.length * randomRange(0.8, 1.2), 20, 200);
      break;
    case 2: // Tamaño Hoja (Añadido límite máximo de 80)
      mutation.leafSize = clamp(species.leafSize * randomRange(0.75, 1.3), 8, 80);
      break;
    case 3: // Tamaño Flor (Añadido límite máximo de 100)
      mutation.flowerSize = clamp(species.flowerSize * randomRange(0.75, 1.3), 10, 100);
      break;
    case 4: // Pétalos
      mutation.petalCount = clamp(species.petalCount + Math.round(randomRange(-2, 2)), 3, 16);
      break;
    case 5: { // Color Flor: Ahora muta gradualmente en lugar de cambiar drásticamente
      const channel = Math.floor(Math.random() * 3);
      mutation.flower[channel] = clamp(mutation.flower[channel] + Math.round(randomRange(-40, 40)), 0, 255);
      break;
    }
    case 6: { // Color Tallo: Muta gradualmente
      const channel = Math.floor(Math.random() * 3);
      mutation.stem[channel] = clamp(mutation.stem[channel] + Math.round(randomRange(-30, 30)), 0, 255);
      break;
    }
  }

  mutation.mutationLevel = "Mutación";
  return mutation;
}

export function hybridizeSpecies(parentA, parentB) {
  const choose = (a, b) => Math.random() < 0.5 ? a : b;
  
  // Recombinación con pequeña desviación (Mutación de color integrada)
  const blendColor = (a, b) => a.map((value, i) => 
    clamp(Math.round((value + b[i]) / 2 + randomRange(-20, 20)), 0, 255)
  );

  // En lugar de promedio exacto, introduce un leve factor de variación (ruido biológico)
  const blendValue = (a, b, min, max) => {
    const avg = (a + b) / 2;
    const noise = randomRange(-avg * 0.1, avg * 0.1); // +/- 10% de variación
    return clamp(Math.round(avg + noise), min, max);
  };

  return {
    name: `${parentA.name.split(" × ")[0]} × ${parentB.name.split(" × ")[0]}`,
    axiom: "X",
    rules: {
      X: choose(parentA.rules.X, parentB.rules.X),
      F: choose(parentA.rules.F ?? "FF", parentB.rules.F ?? "FF")
    },
    angle: blendValue(parentA.angle, parentB.angle, 10, 60),
    stem: blendColor(parentA.stem, parentB.stem),
    flower: blendColor(parentA.flower, parentB.flower),
    length: blendValue(parentA.length, parentB.length, 20, 200),
    leafType: choose(parentA.leafType, parentB.leafType),
    leafSize: blendValue(parentA.leafSize, parentB.leafSize, 8, 80),
    flowerType: choose(parentA.flowerType, parentB.flowerType),
    flowerSize: blendValue(parentA.flowerSize, parentB.flowerSize, 10, 100),
    petalCount: clamp(Math.round((parentA.petalCount + parentB.petalCount) / 2 + randomRange(-1, 1)), 3, 16),
    hybrid: true,
    mutationLevel: "Híbrido"
  };
}
