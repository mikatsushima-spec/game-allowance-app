// Replace balance bar charts with the combined daily Nintendo Switch play-time setting.
(function(){
  function gameUseMinutes(e){
    if(e.date!==today()) return 0;
    if(e.reward==='game' && Number(e.delta)<0) return Math.abs(Number(e.delta)||0);
    if(e.rewardType==='game' && e.type==='use') return Math.abs(Number(e.deltaGameMinutes)||0);
    return 0;
  }
  function combinedToday(){return entries.reduce((sum,e)=>sum+gameUseMinutes(e),0);}
  function renderSwitchSetting(){
    const charts=document.getElementById('charts');
    if(!charts) return;
    const total=combinedToday();
    charts.className='';
    charts.innerHTML=`<div style="margin-top:10px;padding:9px 14px;border:1px solid #dbe7ff;border-radius:14px;background:#f4f8ff;display:flex;align-items:center;justify-content:space-between;gap:12px"><div style="font-size:11px;font-weight:900;color:#475569">みまもりSwitch 今日の「あそぶ時間」</div><div style="font-size:21px;font-weight:950;letter-spacing:-.03em;color:#183b7a;white-space:nowrap">${fmtMin(total)}</div></div>`;
  }
  const previous=renderDashboard;
  renderDashboard=function(){previous();renderSwitchSetting();};
  renderSwitchSetting();
})();