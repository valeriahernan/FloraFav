
export function createPlantRenderer(holder){
  let current={sentence:"",species:null,age:1};

  const instance=new p5(p=>{
    p.setup=()=>{
      const canvas=p.createCanvas(
        Math.max(240,holder.clientWidth-8),420
      );
      canvas.parent(holder);
      p.noLoop();
    };

    function flower(color){
      p.push();
      p.noStroke();
      const size=11;
      for(let i=0;i<6;i++){
        p.push();
        p.rotate(i*p.TWO_PI/6);
        p.fill(...color);
        p.ellipse(0,-size*.65,size*.65,size);
        p.pop();
      }
      p.fill(255,205,65);
      p.circle(0,0,5);
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
        }
        else if(char==="+"){
          p.rotate(p.radians(species.angle));
        }
        else if(char==="-"){
          p.rotate(-p.radians(species.angle));
        }
        else if(char==="["){
          p.push();
        }
        else if(char==="]"){
          p.pop();
        }
        else if(char==="X"||char==="B"){
          flower(species.flower);
        }
      }
      p.pop();
    };

    instance.update=(sentence,species,age)=>{
      current={sentence,species,age};
      p.redraw();
    };

    instance.resize=()=>{
      p.resizeCanvas(
        Math.max(240,holder.clientWidth-8),420
      );
      p.redraw();
    };
  });

  const observer=new ResizeObserver(()=>instance.resize());
  observer.observe(holder);

  return instance;
}
