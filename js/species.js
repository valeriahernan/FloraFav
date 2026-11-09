// species.js

// --- BASE DE DATOS GENÉTICA ORIGINAL ---
export const species = {
  fleabane: {
    name: "Fleabane",
    axiom: "X",
    rules: {
      X: "F[+L]F[-L][+X][-X]B",
      F: "F"
    },
    angle: 25,
    stem: [46, 95, 55],
    flower: [232, 139, 169],
    length: 100,
    leafType: "narrow",
    leafSize: 16,
    flowerType: "daisy",
    flowerSize: 22,
    petalCount: 12
  },

  clover: {
    name: "Clover",
    axiom: "X",
    rules: {
      X: "F[+L][-L]F[+X][-X]B",
      F: "F"
    },
    angle: 28,
    stem: [35, 110, 75],
    flower: [245, 239, 215],
    length: 65,
    leafType: "clover",
    leafSize: 24,
    flowerType: "clover",
    flowerSize: 17,
    petalCount: 3
  },

  violet: {
    name: "Violet",
    axiom: "X",
    rules: {
      X: "F[-L][+L]F[+X]B",
      F: "F"
    },
    angle: 35,
    stem: [105, 160, 90],
    flower: [105, 55, 170],
    length: 90,
    leafType: "oval",
    leafSize: 22,
    flowerType: "violet",
    flowerSize: 25,
    petalCount: 5
  },

  cosmos: {
    name: "Cosmos",
    axiom: "X",
    rules: {
      X: "F[+L]F[-L][+X]F[-X]B",
      F: "F"
    },
    angle: 32,
    stem: [55, 115, 65],
    flower: [238, 105, 155],
    length: 95,
    leafType: "feathery",
    leafSize: 19,
    flowerType: "daisy",
    flowerSize: 24,
    petalCount: 8
  },

  aciano: {
    name: "Aciano",
    axiom: "X",
    rules: {
      X: "F[+L][-L]F[+X]F[-X]B",
      F: "F"
    },
    angle: 27,
    stem: [55, 105, 75],
    flower: [55, 105, 220],
    length: 100,
    leafType: "narrow",
    leafSize: 18,
    flowerType: "spiky",
    flowerSize: 23,
    petalCount: 14
  },

  amapola: {
    name: "Amapola",
    axiom: "X",
    rules: {
      X: "F[+L]F[-L]F[+X][-X]B",
      F: "F"
    },
    angle: 22,
    stem: [65, 115, 65],
    flower: [220, 55, 65],
    length: 110,
    leafType: "lobed",
    leafSize: 22,
    flowerType: "poppy",
    flowerSize: 30,
    petalCount: 4
  },

  dedalera: {
    name: "Dedalera",
    axiom: "X",
    rules: {
      X: "F[+B]F[+X]F[-L]",
      F: "F"
    },
    angle: 18,
    stem: [65, 115, 75],
    flower: [190, 105, 190],
    length: 95,
    leafType: "oval",
    leafSize: 28,
    flowerType: "bell",
    flowerSize: 20,
    petalCount: 5
  },

  lupino: {
    name: "Lupino",
    axiom: "X",
    rules: {
      X: "F[+L]F[-L]F[+X]B",
      F: "F"
    },
    angle: 24,
    stem: [45, 105, 65],
    flower: [130, 85, 195],
    length: 100,
    leafType: "palmate",
    leafSize: 25,
    flowerType: "spike",
    flowerSize: 18,
    petalCount: 5
  },

  pasionaria: {
    name: "Pasionaria",
    axiom: "X",
    rules: {
      X: "F[+L][-L]F[+X]F[-X]B",
      F: "F"
    },
    angle: 38,
    stem: [45, 105, 65],
    flower: [125, 75, 190],
    length: 90,
    leafType: "lobed",
    leafSize: 24,
    flowerType: "passionflower",
    flowerSize: 30,
    petalCount: 10
  }
};

// --- UTILIDADES AUXILIARES ---
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const randomRange = (min, max) => Math.random() * (max - min) + min;

// --- MOTORES GENÉTICOS EXPANDIDOS ---

/**
 * Muta aleatoriamente un gen físico o la estructura del L-System de una planta.
 * Diseñado para soportar acumulación genética extrema de largo recorrido (hasta 1000+ generaciones).
 */
export function mutateSpecies(speciesObj) {
  const mutation = JSON.parse(JSON.stringify(speciesObj));
  
  // Incrementa el contador acumulativo de mutaciones de esta línea genética
  mutation.mutationGeneration = (mutation.mutationGeneration || 0) + 1;
  
  const choice = Math.floor(Math.random() * 8);

  switch (choice) {
    case 0: // Ángulo de ramificación
      mutation.angle = clamp(mutation.angle + randomRange(-12, 12), 5, 120);
      break;
    case 1: // Longitud del tallo
      mutation.length = clamp(mutation.length * randomRange(0.75, 1.3), 10, 1000);
      break;
    case 2: // Tamaño de las hojas
      mutation.leafSize = clamp(mutation.leafSize * randomRange(0.7, 1.4), 4, 500);
      break;
    case 3: // Tamaño de la flor
      mutation.flowerSize = clamp(mutation.flowerSize * randomRange(0.7, 1.4), 5, 600);
      break;
    case 4: // Conteo de pétalos
      mutation.petalCount = clamp(mutation.petalCount + Math.round(randomRange(-3, 3)), 3, 64);
      break;
    case 5: { // Color de la Flor (Canal RGB aleatorio)
      const channel = Math.floor(Math.random() * 3);
      mutation.flower[channel] = clamp(mutation.flower[channel] + Math.round(randomRange(-50, 50)), 0, 255);
      break;
    }
    case 6: { // Color del Tallo (Canal RGB aleatorio)
      const channel = Math.floor(Math.random() * 3);
      mutation.stem[channel] = clamp(mutation.stem[channel] + Math.round(randomRange(-40, 40)), 0, 255);
      break;
    }
    case 7: { // Mutación estructural de las reglas L-System
      let ruleX = mutation.rules.X;
      const structuralMutations = ["[+L]", "[-L]", "[+X]", "[-X]", "F", "B", "[-F]", "[+F]"];
      const mutationType = Math.floor(Math.random() * 3);

      if (mutationType === 0 && ruleX.length < 150) { 
        const randomBlock = structuralMutations[Math.floor(Math.random() * structuralMutations.length)];
        const insertPos = Math.floor(Math.random() * (ruleX.length + 1));
        ruleX = ruleX.slice(0, insertPos) + randomBlock + ruleX.slice(insertPos);
      } 
      else if (mutationType === 1 && ruleX.length > 5) {
        ruleX = ruleX.replace(/\[\+[L|X|F]\]|\[\-[L|X|F]\]|F|B/, "");
      } 
      else {
        if (ruleX.includes("+") && Math.random() < 0.5) {
          ruleX = ruleX.replace("+", "-");
        } else if (ruleX.includes("-")) {
          ruleX = ruleX.replace("-", "+");
        }
      }

      if (ruleX.trim() !== "") {
        mutation.rules.X = ruleX;
      }
      break;
    }
  }

  mutation.mutationLevel = `Mutación (Gen ${mutation.mutationGeneration})`;
  return mutation;
}

/**
 * Mezcla genéticamente dos plantas padres introduciendo ruido biológico.
 */
export function hybridizeSpecies(parentA, parentB) {
  const choose = (a, b) => Math.random() < 0.5 ? a : b;
  
  const blendColor = (a, b) => a.map((value, i) => 
    clamp(Math.round((value + b[i]) / 2 + randomRange(-20, 20)), 0, 255)
  );

  const blendValue = (a, b, min, max) => {
    const avg = (a + b) / 2;
    const noise = randomRange(-avg * 0.1, avg * 0.1);
    return clamp(Math.round(avg + noise), min, max);
  };

  const cleanName = (name) => {
    const parts = name.split(" × ");
    return parts.length > 2 ? `${parts}…` : name;
  };

  return {
    name: `${cleanName(parentA.name)} × ${cleanName(parentB.name)}`,
    axiom: "X",
    rules: {
      X: choose(parentA.rules.X, parentB.rules.X),
      F: choose(parentA.rules.F ?? "F", parentB.rules.F ?? "F")
    },
    angle: blendValue(parentA.angle, parentB.angle, 5, 120),
    stem: blendColor(parentA.stem, parentB.stem),
    flower: blendColor(parentA.flower, parentB.flower),
    length: blendValue(parentA.length, parentB.length, 10, 1000),
    leafType: choose(parentA.leafType, parentB.leafType),
    leafSize: blendValue(parentA.leafSize, parentB.leafSize, 4, 500),
    flowerType: choose(parentA.flowerType, parentB.flowerType),
    flowerSize: blendValue(parentA.flowerSize, parentB.flowerSize, 5, 600),
    petalCount: clamp(Math.round((parentA.petalCount + parentB.petalCount) / 2 + randomRange(-1, 1)), 3, 64),
    hybrid: true,
    mutationLevel: "Híbrido",
    mutationGeneration: Math.max(parentA.mutationGeneration || 0, parentB.mutationGeneration || 0)
  };
}
