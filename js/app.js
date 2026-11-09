
import {species} from "./species.js";
import {generateLSystem} from "./engine.js";
import {mutateSpecies} from "./genetics.js";
import {createPlantRenderer} from "./renderer.js";

const holder=document.getElementById("canvas-holder");
const slider=document.getElementById("edadSlider");
const ageValue=document.getElementById("edadValor");
const status=document.getElementById("status-especie");
const items=document.querySelectorAll("#listaPlantas li");

let activeName="fleabane";
let activeSpecies={...species.fleabane};
let renderer;

function updatePlant(){
  const age=Number(slider.value);
  ageValue.textContent=age;

  try{
    const sentence=generateLSystem(activeSpecies,age);
    renderer.update(sentence,activeSpecies,age);
    status.textContent="Current: "+activeName;
  }catch(error){
    status.textContent="Growth limit reached";
    console.error(error);
  }
}

function changeSpecies(name){
  if(!species[name])return;

  activeName=name;
  activeSpecies={
    ...species[name],
    stem:[...species[name].stem],
    flower:[...species[name].flower]
  };

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
  changeSpecies(activeName);
});

renderer=createPlantRenderer(holder);
changeSpecies(activeName);
