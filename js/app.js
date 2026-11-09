
import {species} from "./species.js";
import {generateLSystem} from "./engine.js";
import {mutateSpecies,hybridizeSpecies} from "./genetics.js";
import {createPlantRenderer} from "./renderer.js";
import {mutateSpecies,hybridizeSpecies} from "./genetics.js";

const holder=document.getElementById("canvas-holder");
const slider=document.getElementById("edadSlider");
const ageValue=document.getElementById("edadValor");
const status=document.getElementById("status-especie");
const items=document.querySelectorAll("#listaPlantas li");

const parentA=document.getElementById("hybridParentA");
const parentB=document.getElementById("hybridParentB");
const fusionButton=document.getElementById("fusionarPlantas");

let activeName="fleabane";
let activeSpecies;
let originalSpecies;
let renderer;

function cloneSpecies(source){
  return {
    ...source,
    rules:{...source.rules},
    stem:[...source.stem],
    flower:[...source.flower]
  };
}

// Cargar las especies en los selectores
Object.entries(species).forEach(([id,plant])=>{
  parentA.add(new Option(plant.name,id));
  parentB.add(new Option(plant.name,id));
});

parentA.value="fleabane";
parentB.value="clover";

function updatePlant(){
  const age=Number(slider.value);
  ageValue.textContent=age;

  try{
    const sentence=generateLSystem(activeSpecies,age);
    renderer.update(sentence,activeSpecies,age);

    status.textContent="Current: "+activeSpecies.name+
      (activeSpecies.hybrid?" | Hybrid specimen":
      activeSpecies.mutationLevel?" | Mutation: "+activeSpecies.mutationLevel:
      " | Original specimen");

  }catch(error){
    status.textContent="Growth limit reached";
    console.error(error);
  }
}

function changeSpecies(name){
  if(!species[name])return;

  activeName=name;
  activeSpecies=cloneSpecies(species[name]);
  originalSpecies=cloneSpecies(activeSpecies);

  slider.value=3;

  items.forEach(item=>{
    item.classList.toggle(
      "selected",
      item.dataset.especie===name
    );
  });

  updatePlant();
}

// Selección de especies originales
items.forEach(item=>{
  item.addEventListener("click",()=>{
    changeSpecies(item.dataset.especie);
  });
});

// Crecimiento
slider.addEventListener("input",updatePlant);

// Mutación
document.getElementById("mutarPlanta").addEventListener("click",()=>{
  activeSpecies=mutateSpecies(activeSpecies);
  updatePlant();
});

// Reiniciar especie o híbrido
document.getElementById("reiniciarPlanta").addEventListener("click",()=>{
  activeSpecies=cloneSpecies(originalSpecies);
  updatePlant();
});

// Hibridación
fusionButton.addEventListener("click",()=>{
  const first=species[parentA.value];
  const second=species[parentB.value];

  if(!first||!second)return;

  activeSpecies=hybridizeSpecies(first,second);
  originalSpecies=cloneSpecies(activeSpecies);
  activeName=activeSpecies.name;

  items.forEach(item=>item.classList.remove("selected"));

  slider.value=3;
  updatePlant();
});

// Iniciar renderer
renderer=createPlantRenderer(holder);

const observer=new ResizeObserver(()=>{
  renderer.resize();
});

observer.observe(holder);

// Mostrar primera especie
changeSpecies(activeName);
