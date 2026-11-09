
import {species} from "./species.js";
import {generateLSystem} from "./engine.js";
import {mutateSpecies,hybridizeSpecies} from "./genetics.js";
import {createPlantRenderer} from "./renderer.js";

const holder=document.getElementById("canvas-holder");
const slider=document.getElementById("edadSlider");
const ageValue=document.getElementById("edadValor");
const status=document.getElementById("status-especie");
const items=document.querySelectorAll("#listaPlantas li");

const parentA=document.getElementById("hybridParentA");
const parentB=document.getElementById("hybridParentB");
const fusionButton=document.getElementById("fusionarPlantas");

let activeName="fleabane";
let activeSpecies={...species.fleabane};
let originalSpecies={...species.fleabane};
let renderer;

function cloneSpecies(source){
  return {
    ...source,
    rules:{...source.rules},
    stem:[...source.stem],
    flower:[...source.flower]
  };
}

// Cargar especies en los selectores
Object.entries(species).forEach(([id,plant])=>{
  const optionA=new Option(plant.name,id);
  const optionB=new Option(plant.name,id);
  parentA.add(optionA);
  parentB.add(optionB);
});

parentA.value="fleabane";
parentB.value="clover";

function updatePlant(){
  const age=Number(slider.value);
  ageValue.textContent=age;

  try{
    const sentence=generateLSystem(activeSpecies,age);
    renderer.update(sentence,activeSpecies,age);

    status.textContent=activeSpecies.name+
      (activeSpecies.hybrid?" | Híbrido":"");
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

items.forEach(item=>{
  item.addEventListener("click",()=>{
    changeSpecies(item.dataset.especie);
  });
});

slider.addEventListener("input",updatePlant);

document.getElementById("mutarPlanta").addEventListener("click",()=>{
  activeSpecies=mutateSpecies(activeSpecies);
  updatePlant();
});

document.getElementById("reiniciarPlanta").addEventListener("click",()=>{
  activeSpecies=cloneSpecies(originalSpecies);
  updatePlant();
});

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

renderer=createPlantRenderer(holder);

const observer=new ResizeObserver(()=>{
  renderer.resize();
});

observer.observe(holder);

changeSpecies(activeName);
