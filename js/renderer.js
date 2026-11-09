
export function createPlantRenderer(holder){
  let instance;
  let current={sentence:"",species:null,age:1};

  instance=new p5(p=>{
    let canvasWidth=520;
    let canvasHeight=420;

    p.setup=()=>{
      const canvas=p.createCanvas(canvasWidth,canvasHeight);
      canvas.parent(holder);
      p.noLoop();
      resize();
      render();
    };

    p.draw=()=>{
      p.background(255);
      if(!current.species)return;

      const {species,age,sentence}=current;
      const scale=Math.pow(.5,age-1);
      const length=species.length*scale;

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
        }else if(char==="X"){
          p.push();
          p.noStroke();
          p.fill(...species.flower);
          p.ellipse(0,0,9,9);
          p.pop();
        }
      }
      p.pop();
    };

    function resize(){
      const width=Math.max(240,holder.clientWidth-8);
      p.resizeCanvas(width,420);
    }

    function render(){
      p.redraw();
    }

    instance.update=(sentence,species,age)=>{
      current={sentence,species,age};
      render();
    };

    instance.resize=()=>{
      resize();
      render();
    };
  });

  const observer=new ResizeObserver(()=>instance.resize());
  observer.observe(holder);

  return instance;
}
