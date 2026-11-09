
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

const gardenButton=document.getElementById("guardarPlanta");
const gardenSection=document.getElementById("garden");
const gardenGrid=document.getElementById("garden-grid");

let activeName="fleabane";
let activeSpecies;
let originalSpecies;
let renderer;

const STORAGE_KEY="florafav-garden";

function cloneSpecies(source){
  return {
    ...source,
    rules:{...source.rules},
    stem:[...source.stem],
    flower:[...source.flower]
  };
}

function getGarden(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY))||[];
  }catch{
    return [];
  }
}

function saveGarden(plants){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(plants));
}

function renderGarden(){
  if(!gardenGrid)return;

  const plants=getGarden();
  gardenGrid.innerHTML="";

  plants.forEach((plant,index)=>{
    const card=document.createElement("article");
    card.className="garden-plant";

    const name=document.createElement("h3");
    name.textContent=plant.name;

    const details=document.createElement("p");
    details.textContent=plant.hybrid?"Híbrido":plant.mutationLevel?"Mutación":"Especie";

    const date=document.createElement("span");
    date.textContent=new Date(plant.savedAt).toLocaleDateString();

    const remove=document.createElement("button");
    remove.type="button";
    remove.textContent="×";
    remove.setAttribute("aria-label","Eliminar planta");

    remove.addEventListener("click",()=>{
      const updated=getGarden();
      updated.splice(index,1);
      saveGarden(updated);
      renderGarden();
    });

    card.append(name,details,date,remove);
    gardenGrid.appendChild(card);
  });
}

function saveCurrentPlant(){
  const plants=getGarden();

  const savedPlant={
    ...cloneSpecies(activeSpecies),
    savedAt:new Date().toISOString()
  };

  plants.unshift(savedPlant);
  saveGarden(plants);
  renderGarden();

  if(gardenButton){
    gardenButton.textContent="Guardada ✓";
    setTimeout(()=>{
      gardenButton.textContent="Guardar en jardín";
    },1500);
  }
}

// Cargar progenitores
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
      (activeSpecies.hybrid?" | Híbrido":
      activeSpecies.mutationLevel?" | Mutación":"");
  }catch(error){
    status.textContent="Error de crecimiento";
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
    item.classList.toggle("selected",item.dataset.especie===name);
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
  slider.value=3;

  items.forEach(item=>item.classList.remove("selected"));

  updatePlant();
});

if(gardenButton){
  gardenButton.addEventListener("click",saveCurrentPlant);
}

if(gardenSection){
  renderGarden();
}

renderer=createPlantRenderer(holder);

const observer=new ResizeObserver(()=>{
  renderer.resize();
});

observer.observe(holder);
changeSpecies(activeName);
