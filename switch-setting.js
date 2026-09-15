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
    charts.innerHTML=`<div style="margin-top:12px;padding:15px 16px;border:1px solid #dbe7ff;border-radius:17px;background:#f4f8ff;text-align:center"><div style="font-size:12px;font-weight:900;color:#475569">みまもりSwitch 今日の「あそぶ時間」</div><div style="margin-top:5px;font-size:28px;font-weight:950;letter-spacing:-.03em;color:#183b7a">${fmtMin(total)}</div><div style="margin-top:4px;font-size:11px;font-weight:700;color:#64748b">たけき＋ゆうき 合計</div></div>`;
  }
  const previous=renderDashboard;
  renderDashboard=function(){previous();renderSwitchSetting();};
  renderSwitchSetting();
})();