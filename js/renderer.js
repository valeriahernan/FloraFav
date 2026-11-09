
export function createPlantRenderer(holder){
  let current={sentence:"",species:null,age:1};
  let instance;
  let ready=false;

  let dragX=0;
  let dragY=0;
  let lastX=0;
  let lastY=0;
  let zoom=1;
  let lastPinch=0;
  const pointers=new Map();

  instance=new p5(p=>{

    p.setup=()=>{
      const canvas=p.createCanvas(
        Math.max(1,holder.clientWidth),
        holder.clientHeight||280
      );

      canvas.parent(holder);

      const el=canvas.elt;
      el.style.touchAction="none";

      el.addEventListener("wheel",e=>{
        e.preventDefault();
        zoom=Math.max(.5,Math.min(3,zoom*(e.deltaY<0?1.1:.9)));
        p.redraw();
      },{passive:false});

      el.addEventListener("pointerdown",e=>{
        pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
        el.setPointerCapture(e.pointerId);

        if(pointers.size===1){
          lastX=e.clientX;
          lastY=e.clientY;
        }

        if(pointers.size===2){
          const pts=[...pointers.values()];
          lastPinch=Math.hypot(
            pts[0].x-pts[1].x,
            pts[0].y-pts[1].y
          );
        }
      });

      el.addEventListener("pointermove",e=>{
        if(!pointers.has(e.pointerId))return;

        pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});

        if(pointers.size===1){
          dragX+=e.clientX-lastX;
          dragY+=e.clientY-lastY;
          lastX=e.clientX;
          lastY=e.clientY;
        }else if(pointers.size===2){
          const pts=[...pointers.values()];
          const distance=Math.hypot(
            pts[0].x-pts[1].x,
            pts[0].y-pts[1].y
          );

          if(lastPinch>0){
            zoom=Math.max(.5,Math.min(3,zoom*distance/lastPinch));
          }

          lastPinch=distance;
        }

        p.redraw();
      });

      function removePointer(e){
        pointers.delete(e.pointerId);
        lastPinch=0;

        if(pointers.size===1){
          const remaining=[...pointers.values()][0];
          lastX=remaining.x;
          lastY=remaining.y;
        }
      }

      el.addEventListener("pointerup",removePointer);
      el.addEventListener("pointercancel",removePointer);
      el.addEventListener("lostpointercapture",removePointer);

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
        p.bezierVertex(
          -size*.2,-size*.2,
          -size*.65,-size*.05,
          -size*.5,size*.15
        );
        p.bezierVertex(
          -size*.2,size*.35,
          size*.2,size*.35,
          size*.5,size*.15
        );
        p.bezierVertex(
          size*.65,-size*.05,
          size*.2,-size*.2,
          size*.2,-size*.65
        );
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
          p.line(
            0,0,
            Math.cos(i*p.TWO_PI/24)*size*.5,
            Math.sin(i*p.TWO_PI/24)*size*.5
          );
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
      const progress=(age-1)/99;
      const length=species.length*(.38+progress*.12);

      p.push();
      p.translate(
        p.width/2+dragX,
        p.height-20+dragY
      );
      p.scale(zoom);
      p.rotate(-p.HALF_PI);

      p.stroke(...species.stem);
      p.strokeWeight(2/zoom);
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

      instance.resizeCanvas(
        Math.max(1,holder.clientWidth),
        holder.clientHeight||280
      );

      instance.redraw();
    }
  };
}
