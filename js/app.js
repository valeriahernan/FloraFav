
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

const saveButton=document.getElementById("savePlant");

const labTab=document.getElementById("labTab");
const gardenTab=document.getElementById("gardenTab");

const labView=document.getElementById("laboratory-view");
const gardenView=document.getElementById("garden-view");

const gardenGrid=document.getElementById("garden-grid");
const gardenEmpty=document.getElementById("garden-empty");
const gardenCount=document.getElementById("garden-count");
const gardenTotal=document.getElementById("garden-total");
const goToLab=document.getElementById("goToLab");

const STORAGE_KEY="florafav-garden";

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

// JARDÍN

function getGarden(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved)?saved:[];
  }catch(error){
    console.error("Error al cargar el jardín:",error);
    return [];
  }
}

function saveGarden(plants){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(plants));
}

function updateGardenCount(total){
  gardenCount.textContent=total;
  gardenTotal.textContent=`${total} ${total===1?"plant":"plants"}`;
}

function renderGarden(){
  const plants=getGarden();

  gardenGrid.innerHTML="";
  gardenEmpty.hidden=plants.length>0;

  updateGardenCount(plants.length);

  plants.forEach(plant=>{
    const card=document.createElement("article");
    card.className="garden-card";

    const info=document.createElement("div");
    info.className="garden-card-info";

    const name=document.createElement("h3");
    name.textContent=plant.name;

    const type=document.createElement("p");
    type.textContent=plant.hybrid
      ?"Híbrido"
      :plant.mutationLevel
      ?"Mutación"
      :"Especie original";

    const date=document.createElement("span");
    date.textContent=plant.savedAt
      ?new Date(plant.savedAt).toLocaleDateString("es-CL")
      :"";

    info.append(name,type,date);

    const actions=document.createElement("div");
    actions.className="garden-card-actions";

    const openButton=document.createElement("button");
    openButton.type="button";
    openButton.textContent="Abrir";

    openButton.addEventListener("click",()=>{
      activeSpecies=cloneSpecies(plant);
      originalSpecies=cloneSpecies(plant);
      activeName=null;

      slider.value=plant.age||3;

      items.forEach(item=>{
        item.classList.remove("selected");
      });

      updatePlant();
      setView("laboratory");
    });

    const deleteButton=document.createElement("button");
    deleteButton.type="button";
    deleteButton.textContent="Eliminar";

    deleteButton.addEventListener("click",()=>{
      const updated=getGarden().filter(item=>item.id!==plant.id);
      saveGarden(updated);
      renderGarden();
    });

    actions.append(openButton,deleteButton);
    card.append(info,actions);
    gardenGrid.appendChild(card);
  });
}

function saveCurrentPlant(){
  const plants=getGarden();

  const savedPlant={
    ...cloneSpecies(activeSpecies),
    id:crypto.randomUUID(),
    age:Number(slider.value),
    savedAt:new Date().toISOString()
  };

  plants.unshift(savedPlant);
  saveGarden(plants);
  renderGarden();

  saveButton.textContent="✓ Guardada";

  setTimeout(()=>{
    saveButton.textContent="+ Guardar en jardín";
  },1500);
}

// NAVEGACIÓN

function setView(view){
  const isGarden=view==="garden";

  labView.hidden=isGarden;
  gardenView.hidden=!isGarden;

  labTab.classList.toggle("active",!isGarden);
  gardenTab.classList.toggle("active",isGarden);

  if(isGarden){
    renderGarden();
  }else{
    renderer.resize();
  }
}

labTab.addEventListener("click",()=>{
  setView("laboratory");
});

gardenTab.addEventListener("click",()=>{
  setView("garden");
});

goToLab.addEventListener("click",()=>{
  setView("laboratory");
});

// PROGENITORES

Object.entries(species).forEach(([id,plant])=>{
  parentA.add(new Option(plant.name,id));
  parentB.add(new Option(plant.name,id));
});

parentA.value="fleabane";
parentB.value="clover";

// RENDERIZADO

function updatePlant(){
  if(!activeSpecies)return;

  const age=Number(slider.value);
  ageValue.textContent=age;

  try{
    const sentence=generateLSystem(activeSpecies,age);

    renderer.update(sentence,activeSpecies,age);

    status.textContent="Current: "+activeSpecies.name+
      (activeSpecies.hybrid
        ?" | Híbrido"
        :activeSpecies.mutationLevel
        ?" | Mutación"
        :"");

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
    item.classList.toggle(
      "selected",
      item.dataset.especie===name
    );
  });

  updatePlant();
}

// SELECCIÓN DE ESPECIES

items.forEach(item=>{
  item.addEventListener("click",()=>{
    changeSpecies(item.dataset.especie);
  });
});

slider.addEventListener("input",updatePlant);

// MUTACIONES

document.getElementById("mutarPlanta").addEventListener("click",()=>{
  activeSpecies=mutateSpecies(activeSpecies);
  activeName=null;
  updatePlant();
});

document.getElementById("reiniciarPlanta").addEventListener("click",()=>{
  activeSpecies=cloneSpecies(originalSpecies);
  updatePlant();
});

// HIBRIDACIÓN

fusionButton.addEventListener("click",()=>{
  const first=species[parentA.value];
  const second=species[parentB.value];

  if(!first||!second)return;

  activeSpecies=hybridizeSpecies(first,second);
  originalSpecies=cloneSpecies(activeSpecies);
  activeName=null;

  slider.value=3;

  items.forEach(item=>{
    item.classList.remove("selected");
  });

  updatePlant();
});

// GUARDAR PLANTA

saveButton.addEventListener("click",saveCurrentPlant);

// INICIALIZACIÓN

renderer=createPlantRenderer(holder);

const observer=new ResizeObserver(()=>{
  renderer.resize();
});

observer.observe(holder);

renderGarden();
changeSpecies(activeName);
setView("laboratory");
