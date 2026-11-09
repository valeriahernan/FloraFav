
export function createPlantRenderer(holder){
  let current={sentence:"",species:null,age:1};
  let instance;
  let ready=false;

  instance=new p5(p=>{
    p.setup=()=>{
      const canvas=p.createCanvas(Math.max(240,holder.clientWidth-8),420);
      canvas.parent(holder);
      p.noLoop();
      ready=true;
      p.redraw();
    };

    function drawLeaf(type,size){
      const color=current.species.stem;
      p.push();
      p.noStroke();
      p.fill(...color);
      p.rotate(-p.PI/3);

      if(type==="narrow"){
        p.ellipse(0,-size*.5,size*.3,size);
      }else if(type==="oval"){
        p.ellipse(0,-size*.5,size*.75,size);
      }else if(type==="clover"){
        p.circle(-size*.2,-size*.35,size*.55);
        p.circle(size*.2,-size*.35,size*.55);
        p.circle(0,-size*.75,size*.55);
      }else if(type==="feathery"){
        for(let i=0;i<5;i++){
          const y=-size*(.2+i*.14);
          p.ellipse(-size*.18,y,size*.35,size*.15);
          p.ellipse(size*.18,y,size*.35,size*.15);
        }
      }else if(type==="palmate"){
        for(let i=0;i<7;i++){
          p.push();
          p.rotate(p.radians(-75+i*25));
          p.ellipse(0,-size*.35,size*.3,size*.75);
          p.pop();
        }
      }else if(type==="lobed"){
        p.ellipse(0,-size*.45,size*.55,size*.9);
        for(let i=0;i<3;i++){
          p.circle(-size*.2+i*size*.2,-size*.5,size*.3);
        }
      }else{
        p.ellipse(0,-size*.5,size*.7,size);
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
          p.ellipse(0,-size*.58,size*.27,size*.85);
          p.pop();
        }
        p.fill(255,205,65);
        p.circle(0,0,size*.32);

      }else if(type==="clover"){
        for(let i=0;i<3;i++){
          p.push();
          p.rotate(i*p.TWO_PI/3);
          p.fill(...color);
          p.ellipse(0,-size*.3,size*.55,size*.65);
          p.pop();
        }
        p.fill(235,205,120);
        p.circle(0,0,size*.18);

      }else if(type==="violet"){
        for(let i=0;i<5;i++){
          p.push();
          p.rotate(i*p.TWO_PI/5);
          p.fill(...color);
          p.ellipse(0,-size*.28,size*.55,size*.75);
          p.pop();
        }
        p.fill(245,215,100);
        p.ellipse(0,0,size*.22,size*.3);

      }else if(type==="spiky"){
        for(let i=0;i<count;i++){
          p.push();
          p.rotate(i*p.TWO_PI/count);
          p.fill(...color);
          p.ellipse(0,-size*.55,size*.22,size*.9);
          p.pop();
        }
        p.fill(235,205,100);
        p.circle(0,0,size*.2);

      }else if(type==="poppy"){
        for(let i=0;i<count;i++){
          p.push();
          p.rotate(i*p.TWO_PI/count);
          p.fill(...color);
          p.ellipse(0,-size*.28,size*.72,size*.78);
          p.pop();
        }
        p.fill(45,35,40);
        p.circle(0,0,size*.3);

      }else if(type==="bell"){
        p.fill(...color);
        p.beginShape();
        p.vertex(-size*.2,-size*.65);
        p.bezierVertex(-size*.2,-size*.2,-size*.65,-size*.05,-size*.5,size*.15);
        p.bezierVertex(-size*.2,size*.35,size*.2,size*.35,size*.5,size*.15);
        p.bezierVertex(size*.65,-size*.05,size*.2,-size*.2,size*.2,-size*.65);
        p.endShape(p.CLOSE);
        p.fill(255,220,220);
        p.circle(0,size*.12,size*.13);

      }else if(type==="spike"){
        for(let i=0;i<7;i++){
          p.push();
          p.translate(0,-i*size*.1);
          p.fill(...color);
          p.ellipse(-size*.12,0,size*.28,size*.2);
          p.ellipse(size*.12,0,size*.28,size*.2);
          p.pop();
        }

      }else if(type==="passionflower"){
        for(let i=0;i<10;i++){
          p.push();
          p.rotate(i*p.TWO_PI/10);
          p.fill(...color);
          p.ellipse(0,-size*.35,size*.32,size*.75);
          p.pop();
        }

        p.stroke(245,220,245);
        p.strokeWeight(1.5);
        for(let i=0;i<24;i++){
          p.line(0,0,Math.cos(i*p.TWO_PI/24)*size*.5,Math.sin(i*p.TWO_PI/24)*size*.5);
        }

        p.noStroke();
        p.fill(245,210,100);
        p.circle(0,0,size*.18);
      }

      p.pop();
    }

    p.draw=()=>{
      p.clear();
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
        }else if(char==="B"){
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
      instance.resizeCanvas(Math.max(240,holder.clientWidth-8),420);
      instance.redraw();
    }
  };
}
