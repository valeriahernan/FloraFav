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
    stem:,
    flower:,
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
    stem:,
    flower:,
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
    stem:,
    flower:,
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
    stem:,
    flower:,
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
    stem:,
    flower:,
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
    stem:,
    flower:,
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
    stem:,
    flower:,
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
    stem:,
    flower:,
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
    stem:,
    flower:,
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

// --- MOTORES GENÉTICOS ---

/**
 * Muta aleatoriamente un gen físico o la estructura del L-System de una planta.
 */
export function mutateSpecies(speciesObj) {
  // Clonado profundo seguro para evitar modificar la planta por referencia
  const mutation = JSON.parse(JSON.stringify(speciesObj));
  
  // 8 opciones posibles (0 a 7), incluyendo la mutación estructural del L-System
  const choice = Math.floor(Math.random() * 8);

  switch (choice) {
    case 0: // Ángulo de ramificación
      mutation.angle = clamp(mutation.angle + randomRange(-8, 8), 10, 60);
      break;
    case 1: // Longitud del tallo
      mutation.length = clamp(mutation.length * randomRange(0.8, 1.2), 20, 200);
      break;
    case 2: // Tamaño de las hojas
      mutation.leafSize = clamp(mutation.leafSize * randomRange(0.75, 1.3), 8, 80);
      break;
    case 3: // Tamaño de la flor
      mutation.flowerSize = clamp(mutation.flowerSize * randomRange(0.75, 1.3), 10, 100);
      break;
    case 4: // Conteo de pétalos
      mutation.petalCount = clamp(mutation.petalCount + Math.round(randomRange(-2, 2)), 3, 16);
      break;
    case 5: { // Color de la Flor (Mutación cromática gradual)
      const channel = Math.floor(Math.random() * 3);
      mutation.flower[channel] = clamp(mutation.flower[channel] + Math.round(randomRange(-40, 40)), 0, 255);
      break;
    }
    case 6: { // Color del Tallo (Mutación cromática gradual)
      const channel = Math.floor(Math.random() * 3);
      mutation.stem[channel] = clamp(mutation.stem[channel] + Math.round(randomRange(-30, 30)), 0, 255);
      break;
    }
    case 7: { // Mutación estructural del L-System (Evolución de ADN)
      let ruleX = mutation.rules.X;
      const structuralMutations = ["[+L]", "[-L]", "[+X]", "[-X]", "F", "B"];
      const mutationType = Math.floor(Math.random() * 3); // 0: Insertar, 1: Eliminar, 2: Alterar Giros

      if (mutationType === 0 && ruleX.length < 35) { 
        // Inserción
        const randomBlock = structuralMutations[Math.floor(Math.random() * structuralMutations.length)];
        const insertPos = Math.floor(Math.random() * (ruleX.length + 1));
        ruleX = ruleX.slice(0, insertPos) + randomBlock + ruleX.slice(insertPos);
      } 
      else if (mutationType === 1 && ruleX.length > 10) {
        // Eliminación limpia de un rasgo
        ruleX = ruleX.replace(/\[\+[L|X]\]|\[\-[L|X]\]|F|B/, "");
      } 
      else {
        // Intercambio/Sustitución de direcciones (Giro a la inversa)
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

  mutation.mutationLevel = "Mutación";
  return mutation;
}

/**
 * Mezcla genéticamente dos plantas padres introduciendo ruido biológico.
 */
export function hybridizeSpecies(parentA, parentB) {
  const choose = (a, b) => Math.random() < 0.5 ? a : b;
  
  // Recombinación de color + pequeña mutación por hibridación
  const blendColor = (a, b) => a.map((value, i) => 
    clamp(Math.round((value + b[i]) / 2 + randomRange(-20, 20)), 0, 255)
  );

  // Mezcla de dimensiones numéricas con +-10% de variación aleatoria para evitar homogeneidad
  const blendValue = (a, b, min, max) => {
    const avg = (a + b) / 2;
    const noise = randomRange(-avg * 0.1, avg * 0.1);
    return clamp(Math.round(avg + noise), min, max);
  };

  // Limpieza estética de nombres híbridos acumulativos (evita "A × B × A × B × C")
  const cleanName = (name) => name.split(" × ")[0];

  return {
    name: `${cleanName(parentA.name)} × ${cleanName(parentB.name)}`,
    axiom: "X",
    rules: {
      X: choose(parentA.rules.X, parentB.rules.X),
      F: choose(parentA.rules.F ?? "F", parentB.rules.F ?? "F")
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
