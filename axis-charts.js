// Add simple y-axes and gridlines to the existing balance bar charts without changing app logic.
(function(){
  const css=document.createElement('style');
  css.textContent=`
    #charts .mini-chart{padding:12px 8px 10px}
    #charts .bar-area{position:relative;height:174px;padding:30px 4px 0 34px;gap:12px;border-left:1px solid #94a3b8;border-bottom:1px solid #94a3b8;margin:10px 4px 20px 28px;overflow:visible}
    #charts .bar-column{position:relative;z-index:2;width:48px}
    #charts .bar-track{height:104px;width:30px;background:transparent;overflow:visible;border-radius:4px;margin:4px auto 5px}
    #charts .bar-fill{border-radius:5px 5px 0 0;min-height:0}
    #charts .bar-value{font-size:9px}
    #charts .bar-label{font-size:10px;white-space:nowrap}
    #charts .axis-grid{position:absolute;inset:30px 0 0 0;pointer-events:none;z-index:1}
    #charts .axis-line{position:absolute;left:0;right:0;border-top:1px solid #e2e8f0}
    #charts .axis-label{position:absolute;right:calc(100% + 6px);transform:translateY(50%);font-size:8px;font-weight:700;color:#64748b;white-space:nowrap}
    #charts .axis-unit{position:absolute;right:calc(100% + 6px);top:-18px;font-size:8px;font-weight:800;color:#64748b;white-space:nowrap}
  `;
  document.head.appendChild(css);

  function niceMax(v,type){
    if(type==='game') return Math.max(120,Math.ceil(Math.max(0,v)/60)*60);
    return Math.max(100,Math.ceil(Math.max(0,v)/100)*100);
  }
  function label(v,type){
    if(type==='game') return v===0?'0':(v/60)+'h';
    return v===0?'0':v+'円';
  }
  function enhance(){
    const charts=[...document.querySelectorAll('#charts .mini-chart')];
    charts.forEach((chart,idx)=>{
      const type=idx===0?'game':'money';
      const area=chart.querySelector('.bar-area'); if(!area)return;
      const values=[...chart.querySelectorAll('.bar-column')].map(col=>{
        const txt=(col.querySelector('.bar-value')?.textContent||'0');
        if(type==='game'){
          const hm=txt.match(/(?:(-?\d+)時間)?(?:(\d+)分)?/); return ((Number(hm?.[1]||0)*60)+Number(hm?.[2]||0));
        }
        return Number(txt.replace(/[^\d-]/g,''))||0;
      });
      const max=niceMax(Math.max(...values,0),type);
      chart.querySelectorAll('.bar-fill').forEach((bar,i)=>{bar.style.height=Math.max(0,values[i])/max*104+'px'});
      area.querySelector('.axis-grid')?.remove();
      const grid=document.createElement('div');grid.className='axis-grid';
      grid.innerHTML=`<span class="axis-unit">${type==='game'?'時間':'円'}</span>`+[0,25,50,75,100].map(p=>{const v=max*p/100;return `<div class="axis-line" style="bottom:${p}%"><span class="axis-label">${label(v,type)}</span></div>`}).join('');
      area.prepend(grid);
    });
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(enhance));
  const root=document.getElementById('charts'); if(root)obs.observe(root,{childList:true,subtree:true});
  requestAnimationFrame(enhance);
})();