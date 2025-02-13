let P0 = {x: 50, y: 350, relativX: undefined, relativY: undefined};
let P1 = {x: 100, y: 50, relativX: undefined, relativY: undefined};
let P2 = {x: 300, y: 50, relativX: undefined, relativY: undefined};
let P3 = {x: 350, y: 350, relativX: undefined, relativY: undefined};
let A = {x: undefined, y: undefined};
let B = {x: undefined, y: undefined};
let C = {x: undefined, y: undefined};
let D = {x: undefined, y: undefined};
let E = {x: undefined, y: undefined};
let P = {x: undefined, y: undefined};
let t=0
let pd=20

let bezierPoints = [P0,P1,P2,P3]
let strokeWidth = 30; //Bredden af vejen 

function setup() {
  createCanvas(1600, 800);
}

function draw() {
  background(220);
  movePoint();
    let leftCurve = []; //Array til Venstre side af vejen 
    let rightCurve = []; //Array til højre side af vejen
    let centerLine = []; //Array til Striben

  for(let t=0; t<1; t+=0.001){
    calcBezier(t);
    let current = createVector(P.x,P.y);
    centerLine.push(current);

      if (centerLine.length > 1){
        let prev= createVector(centerLine[centerLine.length - 2].x, centerLine[centerLine.length - 2].y);
        let tangent = p5.Vector.sub(current, prev).normalize(); //Beregner tangent-retningen 
        let normal = createVector(-tangent.y, tangent.x). mult(strokeWidth / 2); //Skaber en vinkelret normalvektor 

        leftCurve.push(p5.Vector.add(current, normal)); //skubber punktet til venstre for bezierkurven 
        rightCurve.push(p5.Vector.sub(current,normal)); //Skubber punktet til højre for bezierkurven 
      }
  }
//Vejens bredde
  fill(50); 
  noStroke();
  beginShape();
  for (let v of leftCurve) vertex(v.x, v.y); //tilføjer den venstre kant af vejen
  for (let v of [...rightCurve].reverse()) vertex(v.x, v.y); //tilføjer den højre kant af vejen (i modsat rækkefølge)
  endShape(CLOSE); 

  //Midter Striben 
  stroke(255);
  strokeWeight(5);
  noFill();
  for (let i = 0; i < centerLine.length; i += 10) {
    if (i + 5 < centerLine.length) {
      line(centerLine[i].x, centerLine[i].y, centerLine[i+5].x, centerLine[i+5].y);
    }
  }

  drawPoints();
  supportLines();
}

function calcBezier(t){
  A.x=lerp(P0.x,P1.x,t)
  A.y=lerp(P0.y,P1.y,t)
  B.x=lerp(P1.x,P2.x,t)
  B.y=lerp(P1.y,P2.y,t)
  C.x=lerp(P2.x,P3.x,t)
  C.y=lerp(P2.y,P3.y,t)
  D.x=lerp(A.x,B.x,t)
  D.y=lerp(A.y,B.y,t)
  E.x=lerp(B.x,C.x,t)
  E.y=lerp(B.y,C.y,t)
  P.x=lerp(D.x,E.x,t)
  P.y=lerp(D.y,E.y,t)
}

function supportLines(){
  line(P0.x,P0.y,P1.x,P1.y);
  line(P1.x,P1.y,P2.x,P2.y);
  line(P2.x,P2.y,P3.x,P3.y);
}

function drawPoints(){
  circle(P0.x,P0.y,pd);
  circle(P1.x,P1.y,pd);
  circle(P2.x,P2.y,pd);
  circle(P3.x,P3.y,pd);
}

function movePoint(){
  for(let i=0; i<bezierPoints.length;i++){
    if(bezierPoints[i].relativX!=undefined){ //hvis et punkt er valgt kan det flyttes med musen 
      bezierPoints[i].x=mouseX+bezierPoints[i].relativX
      bezierPoints[i].y=mouseY+bezierPoints[i].relativY
    }
  } 
}

function mousePressed(){
  for(let i=0; i<bezierPoints.length;i++){
    if(dist(bezierPoints[i].x,bezierPoints[i].y,mouseX,mouseY)<10){ //tjek om musen er tæt på punktet
      bezierPoints[i].relativX=bezierPoints[i].x-mouseX
      bezierPoints[i].relativY=bezierPoints[i].y-mouseY
    }
  } 
}

function mouseReleased(){
  for(let i=0; i<bezierPoints.length;i++){ 
    bezierPoints[i].relativX=undefined
    bezierPoints[i].relativY=undefined //nulstiller flytte funktionen, når musen slippes
  } 
}

/*
/////////// version til et virkårligt antal punkter
let points = [ [0, 128], [128, 0], [256, 0], [384, 128] ]
function drawDecasteljau(points){
  for(let i = 0; i < 1; i+=0.001){
    let ps = crlPtReduceDeCasteljau (points, i)
    circle(ps[ps.length-1][0][0],ps[ps.length-1][0][1],10)
  }
}

//https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm 
function crlPtReduceDeCasteljau(points, t) {
    let retArr = [ points.slice () ];
	while (points.length > 1) {
        let midpoints = [];
		for (let i = 0; i+1 < points.length; ++i) {
			let ax = points[i][0];
			let ay = points[i][1];
			let bx = points[i+1][0];
			let by = points[i+1][1];
            // a * (1-t) + b * t = a + (b - a) * t
			midpoints.push([
				ax + (bx - ax) * t,
				ay + (by - ay) * t,
			]);
		}
        retArr.push (midpoints)
		points = midpoints;
	}
	return retArr;
}
////////////////
*/