// Canvas Particles
(function(){
  const c = document.getElementById('ai-canvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w, h, dpr, points = [], mouse = {x:-9999,y:-9999};
  const N = 80, MAX_LINK = 120;

  function resize(){
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = c.width = innerWidth * dpr;
    h = c.height = innerHeight * dpr;
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
    points = Array.from({length:N}, ()=>({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-.5)*.35*dpr, vy:(Math.random()-.5)*.35*dpr,
      r: (Math.random()*1.2+0.6)*dpr
    }));
  }

  function step(){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<N;i++){
      const p = points[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;

      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const md = Math.hypot(dx,dy);
      if(md<180*dpr){ p.vx += (dx/md)*.02; p.vy += (dy/md)*.02; }

      ctx.beginPath();
      ctx.fillStyle = 'rgba(200,220,255,.7)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();

      for(let j=i+1;j<N;j++){
        const q = points[j];
        const lx = p.x-q.x, ly=p.y-q.y;
        const dist = Math.hypot(lx,ly);
        if(dist < MAX_LINK*dpr){
          const a = 1 - dist/(MAX_LINK*dpr);
          ctx.strokeStyle = `rgba(124,58,237,${0.08*a})`;
          ctx.lineWidth = dpr*.9*a;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e=>{
    mouse.x = (e.clientX) * dpr;
    mouse.y = (e.clientY) * dpr;
  }, {passive:true});
  resize(); step();
})();

// Minor parallax for blobs
(function(){
  const blobs = Array.from(document.querySelectorAll('.blob'));
  if(!blobs.length) return;
  window.addEventListener('mousemove', (e)=>{
    const rx = (e.clientX / innerWidth - .5)*8;
    const ry = (e.clientY / innerHeight - .5)*8;
    blobs.forEach((b,i)=>{ b.style.transform = `translate(${rx*(i+1)}px, ${ry*(i+1)}px)`; });
  }, {passive:true});
})();
