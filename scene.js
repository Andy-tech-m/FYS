import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

const canvas = document.getElementById('bg-canvas');
const W = window.innerWidth, H = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x03040a);
scene.fog = new THREE.FogExp2(0x03040a, 0.016);

const camera = new THREE.PerspectiveCamera(55, W/H, 0.1, 300);
camera.position.set(0, 3, 26);
camera.lookAt(0, 0, 0);

scene.add(new THREE.AmbientLight(0x050d18, 8));

const keyL = new THREE.DirectionalLight(0xff6622, 1.8);
keyL.position.set(8,12,6); keyL.castShadow = true;
keyL.shadow.mapSize.set(1024,1024);
keyL.shadow.camera.left=-30; keyL.shadow.camera.right=30;
keyL.shadow.camera.top=20; keyL.shadow.camera.bottom=-20;
scene.add(keyL);

const fillL = new THREE.PointLight(0x00ffff, 3, 60);
fillL.position.set(-12,6,4); scene.add(fillL);

const rimL = new THREE.PointLight(0x0044ff, 2.5, 50);
rimL.position.set(12,-4,-5); scene.add(rimL);

const sparkL = new THREE.PointLight(0xffaa00, 4, 15);
sparkL.position.set(0,0,5); scene.add(sparkL);

function mkTex(sz, base, lines) {
  const cv = document.createElement('canvas'); cv.width = cv.height = sz;
  const cx = cv.getContext('2d');
  cx.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`; cx.fillRect(0,0,sz,sz);
  for(let i=0;i<lines;i++){
    const y=Math.random()*sz, a=Math.random()*0.1+0.015;
    cx.strokeStyle=`rgba(255,255,255,${a})`; cx.lineWidth=Math.random()*1.4+0.2;
    cx.beginPath(); cx.moveTo(0,y); cx.lineTo(sz,y+(Math.random()-.5)*3); cx.stroke();
  }
  const id=cx.getImageData(0,0,sz,sz);
  for(let i=0;i<id.data.length;i+=4){const n=(Math.random()-.5)*16;id.data[i]+=n;id.data[i+1]+=n;id.data[i+2]+=n;}
  cx.putImageData(id,0,0); return new THREE.CanvasTexture(cv);
}
function mkRough(sz) {
  const cv=document.createElement('canvas'); cv.width=cv.height=sz;
  const cx=cv.getContext('2d'), id=cx.createImageData(sz,sz);
  for(let i=0;i<id.data.length;i+=4){const v=90+Math.random()*110;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255;}
  cx.putImageData(id,0,0); return new THREE.CanvasTexture(cv);
}
const rT=mkRough(128);
const mPol=new THREE.MeshStandardMaterial({map:mkTex(256,[35,50,60],140),roughnessMap:rT,color:0x1a3040,metalness:1,roughness:0.08,emissive:0x001828,emissiveIntensity:0.3});
const mStl=new THREE.MeshStandardMaterial({map:mkTex(256,[25,35,42],160),roughnessMap:rT,color:0x0d1820,metalness:0.95,roughness:0.22,emissive:0x000a10,emissiveIntensity:0.1});
const mDrk=new THREE.MeshStandardMaterial({map:mkTex(256,[18,25,32],100),roughnessMap:rT,color:0x10202a,metalness:0.98,roughness:0.15,emissive:0x000810,emissiveIntensity:0.15});
const mCop=new THREE.MeshStandardMaterial({color:0x7a4020,metalness:0.9,roughness:0.3,emissive:0x3a1808,emissiveIntensity:0.25});
const mBor=new THREE.MeshStandardMaterial({color:0x000508,metalness:1,roughness:0.8});

function buildGear(r, teeth, thick, spokes, mat, glowCol) {
  const G = new THREE.Group();
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(r*.88,r*.88,thick,64), mat);
  disk.castShadow = disk.receiveShadow = true;
  G.add(disk);
  [-1,1].forEach(s=>{
    const ch=new THREE.Mesh(new THREE.CylinderGeometry(r*.93,r*.88,thick*.11,64),mat);
    ch.position.y=s*thick*.445; if(s<0)ch.scale.y=-1; G.add(ch);
  });
  for(let i=0;i<teeth;i++){
    const a=(i/teeth)*Math.PI*2;
    const tw=(2*Math.PI*r)/teeth*.52, th=r*.2;
    const sh=new THREE.Shape();
    sh.moveTo(-tw*.38,0);sh.lineTo(-tw*.5,th*.3);sh.lineTo(-tw*.33,th);sh.lineTo(tw*.33,th);sh.lineTo(tw*.5,th*.3);sh.lineTo(tw*.38,0);sh.closePath();
    const geo=new THREE.ExtrudeGeometry(sh,{depth:thick*.88,bevelEnabled:true,bevelThickness:.012,bevelSize:.008,bevelSegments:2});
    geo.center();
    const t=new THREE.Mesh(geo,mat); t.castShadow=true;
    t.position.set(Math.cos(a)*(r*.88+th*.45),0,Math.sin(a)*(r*.88+th*.45));
    t.rotation.y=-a+Math.PI/2; G.add(t);
  }
  for(let i=0;i<spokes;i++){
    const a=(i/spokes)*Math.PI*2;
    const sL=r*.88-r*.27-.05;
    const sm=mat.clone(); sm.emissiveIntensity=(mat.emissiveIntensity||0)*.3;
    const sp=new THREE.Mesh(new THREE.BoxGeometry(sL,thick*.68,r*.08),sm); sp.castShadow=true;
    sp.position.set(Math.cos(a)*(r*.27+sL*.5),0,Math.sin(a)*(r*.27+sL*.5));
    sp.rotation.y=-a; G.add(sp);
    if(glowCol){
      const strip=new THREE.Mesh(new THREE.BoxGeometry(sL*.8,thick*.72,r*.025),new THREE.MeshStandardMaterial({color:glowCol,emissive:glowCol,emissiveIntensity:.5,metalness:1,roughness:.1}));
      strip.position.copy(sp.position); strip.rotation.y=sp.rotation.y; G.add(strip);
    }
  }
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(r*.27,r*.27,thick*1.1,40),mat); hub.castShadow=true; G.add(hub);
  G.add(new THREE.Mesh(new THREE.CylinderGeometry(r*.14,r*.14,thick*1.25,32),mBor));
  if(glowCol){
    const gc=new THREE.Color(glowCol);
    const gm=new THREE.MeshStandardMaterial({color:gc,emissive:gc,emissiveIntensity:3,transparent:true,opacity:.92});
    const gm2=new THREE.MeshStandardMaterial({color:gc,emissive:gc,emissiveIntensity:1.8,transparent:true,opacity:.65});
    [-1,1].forEach(s=>{
      const y=s*(thick*.5+.02);
      const rg=new THREE.Mesh(new THREE.TorusGeometry(r*.72,.025,12,100),gm.clone()); rg.position.y=y; G.add(rg);
      const rg2=new THREE.Mesh(new THREE.TorusGeometry(r*.52,.014,8,80),gm2.clone()); rg2.position.y=y; G.add(rg2);
    });
    const pt=new THREE.PointLight(glowCol,.7,r*4); G.add(pt);
  }
  const bc=Math.min(spokes,6);
  for(let i=0;i<bc;i++){
    const a=(i/bc)*Math.PI*2+Math.PI/bc;
    const bolt=new THREE.Mesh(new THREE.CylinderGeometry(r*.028,r*.028,thick*1.3,12),mBor);
    bolt.position.set(Math.cos(a)*r*.62,0,Math.sin(a)*r*.62); G.add(bolt);
  }
  return G;
}

const GD=[
  {r:4.2,t:32,k:.9,s:6,m:mPol,g:0x00ffff, x:-5,  y:1,  z:-4,  sp:0.004, fp:0,   fa:.10},
  {r:2.6,t:20,k:.75,s:5,m:mStl,g:0x00aaff,x:.2,  y:1,  z:-3.5,sp:-.0065,fp:1.1, fa:.08},
  {r:1.5,t:12,k:.6, s:4,m:mDrk,g:0x0066ff,x:3.2, y:3.5,z:-2,  sp:.011,  fp:2.3, fa:.06},
  {r:3.5,t:28,k:.8, s:6,m:mPol,g:0x00ffcc,x:8,   y:0,  z:-7,  sp:-.005, fp:.5,  fa:.09},
  {r:2.8,t:22,k:.7, s:5,m:mStl,g:0x00eeff,x:-9,  y:-3, z:-6,  sp:.006,  fp:1.7, fa:.08},
  {r:1.8,t:14,k:.55,s:4,m:mDrk,g:0x0099ff,x:5.5, y:4,  z:-5,  sp:-.009, fp:2.8, fa:.07},
  {r:3.0,t:24,k:.75,s:6,m:mPol,g:0x00ffee,x:-13, y:2,  z:-9,  sp:.005,  fp:.3,  fa:.09},
  {r:2.2,t:18,k:.65,s:5,m:mStl,g:0x00ccff,x:1,   y:-5, z:-6,  sp:-.007, fp:3.2, fa:.07},
  {r:1.2,t:10,k:.5, s:4,m:mDrk,g:0x0088ff,x:11,  y:-2, z:-8,  sp:.013,  fp:1.5, fa:.05},
  {r:2.0,t:16,k:.6, s:5,m:mCop,g:0xff6600,x:-3,  y:-4, z:-5,  sp:.008,  fp:4.1, fa:.07},
  {r:5.0,t:40,k:.6, s:8,m:mDrk,g:0x002244,x:3,   y:5,  z:-14, sp:.002,  fp:.8,  fa:.12},
  {r:3.2,t:26,k:.55,s:6,m:mStl,g:0x002233,x:-7,  y:-6, z:-13, sp:-.003, fp:2.0, fa:.10},
];

const allG=[];
GD.forEach(d=>{
  const g=buildGear(d.r,d.t,d.k,d.s,d.m.clone(),d.g);
  g.position.set(d.x,d.y,d.z);
  g.rotation.x=Math.PI/2; g.rotation.z=Math.random()*Math.PI*2;
  g._sp=d.sp; g._bx=d.x; g._by=d.y; g._fp=d.fp; g._fa=d.fa;
  allG.push(g); scene.add(g);
});

const aM=new THREE.MeshStandardMaterial({color:0x0a1520,metalness:.98,roughness:.15});
[[- 5,1,-4,.2,1,-3.5,.07],[.2,1,-3.5,3.2,3.5,-2,.05],[8,0,-7,5.5,4,-5,.06]].forEach(a=>{
  const dx=a[3]-a[0],dy=a[4]-a[1],dz=a[5]-a[2];
  const len=Math.sqrt(dx*dx+dy*dy+dz*dz);
  const rod=new THREE.Mesh(new THREE.CylinderGeometry(a[6],a[6],len,10),aM);
  rod.position.set((a[0]+a[3])/2,(a[1]+a[4])/2,(a[2]+a[5])/2);
  rod.lookAt(new THREE.Vector3(a[3],a[4],a[5])); rod.rotateX(Math.PI/2); scene.add(rod);
});

const SC=500;
const sGeo=new THREE.BufferGeometry();
const sP=new Float32Array(SC*3),sV=new Float32Array(SC*3),sL=new Float32Array(SC);
function rSp(i){
  const d=GD[Math.floor(Math.random()*8)];
  sP[i*3]=d.x+(Math.random()-.5)*d.r*1.5; sP[i*3+1]=d.y+(Math.random()-.5)*d.r*1.5; sP[i*3+2]=d.z+(Math.random()-.5)*1.5;
  const sp=.03+Math.random()*.07,a=Math.random()*Math.PI*2,el=(Math.random()-.3)*Math.PI;
  sV[i*3]=Math.cos(a)*Math.cos(el)*sp; sV[i*3+1]=Math.sin(el)*sp+.012; sV[i*3+2]=Math.sin(a)*Math.cos(el)*sp; sL[i]=Math.random();
}
for(let i=0;i<SC;i++)rSp(i);
sGeo.setAttribute('position',new THREE.BufferAttribute(sP,3));
const sMat=new THREE.PointsMaterial({color:0xffaa33,size:.13,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false});
scene.add(new THREE.Points(sGeo,sMat));

const BC=300;
const bGeo=new THREE.BufferGeometry();
const bP=new Float32Array(BC*3),bV=new Float32Array(BC*3),bL=new Float32Array(BC);
function rBp(i){
  const d=GD[Math.floor(Math.random()*GD.length)];
  bP[i*3]=d.x+(Math.random()-.5)*d.r; bP[i*3+1]=d.y+(Math.random()-.5)*d.r; bP[i*3+2]=d.z+(Math.random()-.5)*1.5;
  const sp=.02+Math.random()*.04,a=Math.random()*Math.PI*2,el=(Math.random()-.5)*Math.PI;
  bV[i*3]=Math.cos(a)*Math.cos(el)*sp; bV[i*3+1]=Math.sin(el)*sp+.008; bV[i*3+2]=Math.sin(a)*Math.cos(el)*sp; bL[i]=Math.random();
}
for(let i=0;i<BC;i++)rBp(i);
bGeo.setAttribute('position',new THREE.BufferAttribute(bP,3));
const bMat2=new THREE.PointsMaterial({color:0x00ddff,size:.08,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false});
scene.add(new THREE.Points(bGeo,bMat2));

const atG=new THREE.BufferGeometry();
const atP=new Float32Array(500*3);
for(let i=0;i<500;i++){atP[i*3]=(Math.random()-.5)*70;atP[i*3+1]=(Math.random()-.5)*40;atP[i*3+2]=(Math.random()-.5)*30-5;}
atG.setAttribute('position',new THREE.BufferAttribute(atP,3));
const atm=new THREE.Points(atG,new THREE.PointsMaterial({color:0x002233,size:.25,transparent:true,opacity:.18,blending:THREE.AdditiveBlending,depthWrite:false}));
scene.add(atm);

const grid=new THREE.GridHelper(120,60,0x001a2a,0x000d15); grid.position.y=-10; scene.add(grid);
const fl=new THREE.Mesh(new THREE.PlaneGeometry(120,120),new THREE.MeshStandardMaterial({color:0x010508,metalness:.95,roughness:.05,transparent:true,opacity:.35}));
fl.rotation.x=-Math.PI/2; fl.position.y=-10; fl.receiveShadow=true; scene.add(fl);

const halos=[];
[[-5,1,-4.5,5.5,0x003344,.28],[8,0,-7.5,4.5,0x002233,.18],[-9,-3,-6.5,3.8,0x003333,.22],[3,5,-14,6.5,0x001122,.14]].forEach(h=>{
  const halo=new THREE.Mesh(new THREE.PlaneGeometry(h[3]*2.5,h[3]*2.5),new THREE.MeshBasicMaterial({color:h[4],transparent:true,opacity:h[5],blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
  halo.position.set(h[0],h[1],h[2]-.5); halo._ph=Math.random()*Math.PI*2; halos.push(halo); scene.add(halo);
});

let tx=0,ty=0,camX=0,camY=3,burst=0;
const mouse=new THREE.Vector2();
document.addEventListener('mousemove',e=>{tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2;mouse.x=tx;mouse.y=-ty;});
window.addEventListener('click',e=>{
  burst=1.0;
  const rc=new THREE.Raycaster(); rc.setFromCamera(mouse,camera);
  const hits=rc.intersectObjects(scene.children,true);
  if(hits.length){
    const pt=hits[0].point;
    for(let i=0;i<60;i++){
      const idx=Math.floor(Math.random()*SC);
      sP[idx*3]=pt.x;sP[idx*3+1]=pt.y;sP[idx*3+2]=pt.z;
      const sp=.09+Math.random()*.12,a=Math.random()*Math.PI*2,el=Math.random()*Math.PI-.5;
      sV[idx*3]=Math.cos(a)*Math.cos(el)*sp;sV[idx*3+1]=Math.sin(el)*sp+.02;sV[idx*3+2]=Math.sin(a)*Math.cos(el)*sp;sL[idx]=1;
    }
  }
});

let T=0;
function animate(){
  requestAnimationFrame(animate);
  T+=.01; burst*=.92;
  const boost=1+burst*3;
  camX+=(tx*3-camX)*.05; camY+=(3-ty*1.5-camY)*.05;
  camera.position.x=camX; camera.position.y=camY; camera.lookAt(0,0,0);
  allG.forEach(g=>{g.rotation.z+=g._sp*boost;g.position.y=g._by+Math.sin(T*.6+g._fp)*g._fa;});
  halos.forEach(h=>{h.material.opacity=.1+Math.sin(T*1.2+h._ph)*.06+burst*.15;h.rotation.z+=.003;});
  fillL.position.x=Math.cos(T*.4)*14; fillL.position.z=Math.sin(T*.4)*8+4; fillL.intensity=2.5+Math.sin(T*1.1)*.5;
  sparkL.position.x=Math.sin(T*.8)*6; sparkL.position.y=Math.cos(T*.6)*4; sparkL.intensity=3+Math.sin(T*3)*1.5+burst*8;
  for(let i=0;i<SC;i++){sL[i]-=.011;if(sL[i]<=0){rSp(i);continue;}sP[i*3]+=sV[i*3];sP[i*3+1]+=sV[i*3+1];sP[i*3+2]+=sV[i*3+2];sV[i*3+1]-=.0008;}
  sGeo.attributes.position.needsUpdate=true; sMat.opacity=.8+Math.sin(T*2)*.1+burst*.15;
  for(let i=0;i<BC;i++){bL[i]-=.009;if(bL[i]<=0){rBp(i);continue;}bP[i*3]+=bV[i*3];bP[i*3+1]+=bV[i*3+1];bP[i*3+2]+=bV[i*3+2];bV[i*3+1]-=.0005;}
  bGeo.attributes.position.needsUpdate=true;
  atm.rotation.y=T*.01; grid.position.y=-10+Math.sin(T*.2)*.3;
  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});