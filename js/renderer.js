
export function createPlantRenderer(holder){
  let current={sentence:"",species:null,age:1};
  let instance;
  let ready=false;

  instance=new p5(p=>{
    p.setup=()=>{
      const canvas=p.createCanvas(
        Math.max(240,holder.clientWidth-8),420
      );
      canvas.parent(holder);
      p.noLoop();
      ready=true;
      p.redraw();
    };

    function drawLeaf(type,size){
      p.push();
      p.noStroke();
      p.fill(...current.species.stem);

      if(type==="narrow"){
        p.ellipse(0,-size*.5,size*.38,size);
      }else if(type==="oval"){
        p.ellipse(0,-size*.5,size*.8,size);
      }else{
        p.ellipse(-size*.22,-size*.35,size*.48,size*.48);
        p.ellipse(size*.22,-size*.35,size*.48,size*.48);
        p.ellipse(0,-size*.7,size*.48,size*.48);
      }
      p.pop();
    }

    function drawFlower(type,color,size,count){
      p.push();
      p.noStroke();

      if(type==="daisy"){
        for(let i=0;i<count;i++){
          p.push();
          p.rotate(i*p.TWO_PI/count);
          p.fill(...color);
          p.ellipse(0,-size*.65,size*.34,size);
          p.pop();
        }
        p.fill(255,205,65);
        p.circle(0,0,size*.4);
      }else if(type==="clover"){
        for(let i=0;i<3;i++){
          p.push();
          p.rotate(i*p.TWO_PI/3);
          p.fill(...color);
          p.circle(0,-size*.35,size*.58);
          p.pop();
        }
        p.fill(230,190,80);
        p.circle(0,0,size*.22);
      }else{
        for(let i=0;i<count;i++){
          p.push();
          p.rotate(i*p.TWO_PI/count);
          p.fill(...color);
          p.ellipse(0,-size*.38,size*.58,size*.8);
          p.pop();
        }
        p.fill(245,215,70);
        p.ellipse(0,0,size*.3,size*.4);
      }
      p.pop();
    }

    p.draw=()=>{
      p.background(255);
      if(!current.species)return;

      const {species,age,sentence}=current;
      const length=species.length*Math.pow(.58,age-1);

      p.push();
      p.translate(p.width/2,p.height-20);
      p.rotate(-p.HALF_PI);
      p.stroke(...species.stem);
      p.strokeWeight(2);
      p.noFill();

      for(const char of sentence){
        if(char==="F"){
          p.line(0,0,length,0);
          p.translate(length,0);
        }else if(char==="+"){
          p.rotate(p.radians(species.angle));
        }else if(char==="-"){
          p.rotate(-p.radians(species.angle));
        }else if(char==="["){
          p.push();
        }else if(char==="]"){
          p.pop();
        }else if(char==="L"){
          drawLeaf(species.leafType,species.leafSize);
        }else if(char==="X"||char==="B"){
          drawFlower(
            species.flowerType,
            species.flower,
            species.flowerSize,
            species.petalCount
          );
        }
      }
      p.pop();
    };
  });

  return {
    update(sentence,species,age){
      current={sentence,species,age};
      if(ready)instance.redraw();
    },
    resize(){
      if(!ready)return;
      instance.resizeCanvas(
        Math.max(240,holder.clientWidth-8),420
      );
      instance.redraw();
    }
  };
}
