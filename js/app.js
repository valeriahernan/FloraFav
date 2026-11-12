
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
const gardenStage=document.getElementById("garden-stage");
const gardenStageEmpty=document.getElementById("garden-stage-empty");
const goToLab=document.getElementById("goToLab");
const exportGardenButton=document.getElementById("garden-export");

const STORAGE_KEY="florafav-garden";
const STAGE_KEY="florafav-garden-layout";

let activeName="fleabane";
let activeSpecies;
let originalSpecies;
let renderer;

const stageRenderers=new Map();

function cloneSpecies(source){
  return {
    ...source,
    rules:{...source.rules},
    stem:[...source.stem],
    flower:[...source.flower]
  };
}

// ALMACENAMIENTO

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

function getStageLayout(){
  try{
    return JSON.parse(localStorage.getItem(STAGE_KEY))||{};
  }catch{
    return {};
  }
}

function saveStageLayout(layout){
  localStorage.setItem(STAGE_KEY,JSON.stringify(layout));
}

function updateGardenCount(total){
  if(gardenCount) gardenCount.textContent=total;
  if(gardenTotal){
    gardenTotal.textContent=`${total} ${total===1?"plant":"plants"}`;
  }
}

// COLECCIÓN

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

    const addButton=document.createElement("button");
    addButton.type="button";
    addButton.textContent="Añadir al jardín";
    addButton.addEventListener("click",()=>{
      addPlantToStage(plant);
    });

    const openButton=document.createElement("button");
    openButton.type="button";
    openButton.textContent="Abrir";
    openButton.addEventListener("click",()=>{
      activeSpecies=cloneSpecies(plant);
      originalSpecies=cloneSpecies(plant);
      activeName=null;

      slider.value=plant.age||3;

      items.forEach(item=>item.classList.remove("selected"));

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

    actions.append(addButton,openButton,deleteButton);
    card.append(info,actions);
    gardenGrid.appendChild(card);
  });

  renderGardenStage();
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

// ESCENARIO DEL JARDÍN

function addPlantToStage(plant){
  const layout=getStageLayout();

  if(layout[plant.id]){
    return;
  }

  const index=Object.keys(layout).length;

  layout[plant.id]={
    x:30+(index%4)*120,
    y:40+Math.floor(index/4)*30,
    width:150,
    height:210
  };

  saveStageLayout(layout);
  renderGardenStage();
}

function renderGardenStage(){
  if(!gardenStage)return;

   stageRenderers.forEach(entry=>{
  entry.observer?.disconnect();
  entry.renderer?.destroy();
  });

  stageRenderers.clear();

  gardenStage.querySelectorAll(".garden-plant-item").forEach(item=>item.remove());

  const plants=getGarden();
  const layout=getStageLayout();

  const placed=plants.filter(plant=>layout[plant.id]);

  if(gardenStageEmpty){
    gardenStageEmpty.hidden=placed.length>0;
  }

  placed.forEach(plant=>{
    const position=layout[plant.id];

    const item=document.createElement("div");
    item.className="garden-plant-item";
    item.dataset.plantId=plant.id;

    Object.assign(item.style,{
      position:"absolute",
      left:`${position.x}px`,
      top:`${position.y}px`,
      width:`${position.width}px`,
      height:`${position.height}px`,
      zIndex:"2"
    });

    const handle=document.createElement("div");
    handle.className="garden-plant-handle";
    handle.textContent=plant.name||"Plant";
    handle.style.cssText="height:22px;cursor:grab;font-size:10px;padding:4px;background:#f0f0f0;border:1px solid #aaa;overflow:hidden;";

    const plantHolder=document.createElement("div");
    plantHolder.className="garden-plant-canvas";
    plantHolder.style.cssText="width:100%;height:calc(100% - 22px);overflow:hidden;";

    const controls=document.createElement("div");
    controls.className="garden-plant-controls";
    controls.style.cssText="position:absolute;right:2px;top:24px;display:flex;gap:2px;z-index:5;";

    const smaller=document.createElement("button");
    smaller.type="button";
    smaller.textContent="−";
    smaller.title="Reducir tamaño";

    const larger=document.createElement("button");
    larger.type="button";
    larger.textContent="+";
    larger.title="Aumentar tamaño";

    const remove=document.createElement("button");
    remove.type="button";
    remove.textContent="×";
    remove.title="Quitar del jardín";

    controls.append(smaller,larger,remove);
    item.append(handle,plantHolder,controls);
    gardenStage.appendChild(item);

    const plantRenderer=createPlantRenderer(plantHolder);
    const age=Number(plant.age)||3;
    const sentence=generateLSystem(plant,age);

    plantRenderer.update(sentence,plant,age);

    const observer=new ResizeObserver(()=>{
      plantRenderer.resize();
    });

    observer.observe(plantHolder);

    stageRenderers.set(plant.id,{
      renderer:plantRenderer,
      observer
    });

    function updatePosition(){
      const current=getStageLayout();
      current[plant.id]={
        x:parseFloat(item.style.left),
        y:parseFloat(item.style.top),
        width:item.offsetWidth,
        height:item.offsetHeight
      };
      saveStageLayout(current);
    }

    // MOVER PLANTA

    let dragging=false;
    let startX=0;
    let startY=0;
    let initialX=0;
    let initialY=0;

    handle.addEventListener("pointerdown",event=>{
      if(event.target.closest("button"))return;

      dragging=true;
      startX=event.clientX;
      startY=event.clientY;
      initialX=parseFloat(item.style.left);
      initialY=parseFloat(item.style.top);

      handle.setPointerCapture(event.pointerId);
    });

    handle.addEventListener("pointermove",event=>{
      if(!dragging)return;

      const maxX=gardenStage.clientWidth-item.offsetWidth;
      const maxY=gardenStage.clientHeight-item.offsetHeight;

      const x=Math.max(0,Math.min(maxX,initialX+event.clientX-startX));
      const y=Math.max(0,Math.min(maxY,initialY+event.clientY-startY));

      item.style.left=`${x}px`;
      item.style.top=`${y}px`;
    });

    handle.addEventListener("pointerup",()=>{
      if(!dragging)return;
      dragging=false;
      updatePosition();
    });

    // CAMBIAR TAMAÑO

    smaller.addEventListener("click",()=>{
      item.style.width=`${Math.max(80,item.offsetWidth-20)}px`;
      item.style.height=`${Math.max(120,item.offsetHeight-20)}px`;
      updatePosition();
      plantRenderer.resize();
    });

    larger.addEventListener("click",()=>{
      item.style.width=`${Math.min(320,item.offsetWidth+20)}px`;
      item.style.height=`${Math.min(400,item.offsetHeight+20)}px`;
      updatePosition();
      plantRenderer.resize();
    });

    // QUITAR DEL ESCENARIO SIN BORRAR DE LA COLECCIÓN

    remove.addEventListener("click",()=>{
      const current=getStageLayout();
      delete current[plant.id];
      saveStageLayout(current);
      renderGardenStage();
    });
  });
}

// EXPORTAR JARDÍN

if(exportGardenButton){
  exportGardenButton.addEventListener("click",()=>{
    if(!gardenStage)return;

    const canvases=gardenStage.querySelectorAll("canvas");
    if(!canvases.length)return;

    const output=document.createElement("canvas");
    output.width=gardenStage.clientWidth*2;
    output.height=gardenStage.clientHeight*2;

    const context=output.getContext("2d");
    context.scale(2,2);

    const gradient=context.createLinearGradient(
  0,0,0,gardenStage.clientHeight
);

gradient.addColorStop(0,"#b9dce0");
gradient.addColorStop(.65,"#d8e9df");
gradient.addColorStop(.65,"#8eae83");
gradient.addColorStop(1,"#8eae83");

context.fillStyle=gradient;
context.fillRect(0,0,gardenStage.clientWidth,gardenStage.clientHeight);

    canvases.forEach(canvas=>{
      const item=canvas.closest(".garden-plant-item");
      if(!item)return;

      const holder=item.querySelector(".garden-plant-canvas");
      const x=parseFloat(item.style.left);
      const y=parseFloat(item.style.top)+22;

      context.drawImage(
        canvas,
        x,
        y,
        holder.clientWidth,
        holder.clientHeight
      );
    });

    const link=document.createElement("a");
    link.download="florafav-garden.png";
    link.href=output.toDataURL("image/png");
    link.click();
  });
}

// NAVEGACIÓN

function setView(view){
  const isGarden=view==="garden";

  labView.hidden=isGarden;
  gardenView.hidden=!isGarden;

  labView.classList.toggle("active",!isGarden);
  gardenView.classList.toggle("active",isGarden);

  labTab.classList.toggle("active",!isGarden);
  gardenTab.classList.toggle("active",isGarden);

  if(isGarden){
    renderGarden();
  }else{
    requestAnimationFrame(()=>renderer.resize());
  }
}

labTab.addEventListener("click",()=>setView("laboratory"));
gardenTab.addEventListener("click",()=>setView("garden"));
goToLab.addEventListener("click",()=>setView("laboratory"));

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
    item.classList.toggle("selected",item.dataset.especie===name);
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

  items.forEach(item=>item.classList.remove("selected"));

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
