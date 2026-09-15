// Daily game usage: weekdays 2h, weekends/Japanese holidays 4h.
// Holiday table includes substitute holidays and Citizens' Holidays for 2026-2030.
const jpHolidaysDailyLimit=new Set(['2026-01-01','2026-01-12','2026-02-11','2026-02-23','2026-03-20','2026-04-29','2026-05-03','2026-05-04','2026-05-05','2026-05-06','2026-07-20','2026-08-11','2026-09-21','2026-09-22','2026-09-23','2026-10-12','2026-11-03','2026-11-23','2027-01-01','2027-01-11','2027-02-11','2027-02-23','2027-03-21','2027-03-22','2027-04-29','2027-05-03','2027-05-04','2027-05-05','2027-07-19','2027-08-11','2027-09-20','2027-09-23','2027-10-11','2027-11-03','2027-11-23','2028-01-01','2028-01-10','2028-02-11','2028-02-23','2028-03-20','2028-04-29','2028-05-03','2028-05-04','2028-05-05','2028-07-17','2028-08-11','2028-09-18','2028-09-22','2028-10-09','2028-11-03','2028-11-23','2029-01-01','2029-01-08','2029-02-11','2029-02-12','2029-02-23','2029-03-20','2029-04-29','2029-04-30','2029-05-03','2029-05-04','2029-05-05','2029-07-16','2029-08-11','2029-09-17','2029-09-23','2029-09-24','2029-10-08','2029-11-03','2029-11-23','2030-01-01','2030-01-14','2030-02-11','2030-02-23','2030-03-20','2030-04-29','2030-05-03','2030-05-04','2030-05-05','2030-05-06','2030-07-15','2030-08-11','2030-08-12','2030-09-16','2030-09-23','2030-10-14','2030-11-03','2030-11-04','2030-11-23']);
function dailyGameLimit(dateStr){const d=new Date(dateStr+'T00:00:00');return (d.getDay()===0||d.getDay()===6||jpHolidaysDailyLimit.has(dateStr))?240:120;}
function dailyGameUsed(child,dateStr){return entries.filter(e=>e.child===child&&e.date===dateStr&&e.type==='use'&&e.rewardType==='game').reduce((sum,e)=>sum+Math.abs(e.deltaGameMinutes||0),0);}
const originalRenderDashboard=renderDashboard;
renderDashboard=function(){
  originalRenderDashboard();
  const date=today(),limit=dailyGameLimit(date);
  document.querySelectorAll('#balances .balance-card').forEach((card,i)=>{
    const child=children[i],used=dailyGameUsed(child,date),pct=Math.min(100,used/limit*100),over=used>limit;
    const box=document.createElement('div');
    box.style.cssText='margin-top:10px;padding-top:9px;border-top:1px solid #edf1f5';
    box.innerHTML=`<div style="font-size:10px;font-weight:800;color:#64748b">今日のゲーム ${limit===240?'休日':'平日'}</div><div style="margin-top:2px;font-size:13px;font-weight:900;color:${over?'#b42318':'#0f172a'}">${fmtMin(used)} / ${fmtMin(limit)}</div><div style="height:6px;margin-top:7px;border-radius:999px;background:#e8eef6;overflow:hidden"><div style="height:100%;width:${pct}%;border-radius:999px;background:#3567c8"></div></div>`;
    card.appendChild(box);
  });
};