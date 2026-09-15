// Add gymnastics class as a fixed 2-hour reward without changing existing app logic.
(function(){
  const CATEGORY='体操教室';
  function install(){
    if(!Array.isArray(window.categories) && typeof categories==='undefined') return false;
    try{
      if(!categories.includes(CATEGORY)) categories.push(CATEGORY);
      fixed[CATEGORY]=120;
      const originalRenderControls=renderControls;
      renderControls=function(){ return originalRenderControls.apply(this,arguments); };
      renderControls();
      updatePreview();
      return true;
    }catch(e){return false;}
  }
  if(!install()) window.addEventListener('load',install,{once:true});
})();