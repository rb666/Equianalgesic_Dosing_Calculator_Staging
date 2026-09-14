const logos = window.logoPreviewCatalog;
const grid=document.querySelector('#logoGrid');
const status=document.querySelector('#comparisonStatus');
const left=document.querySelector('#leftLogo');
const right=document.querySelector('#rightLogo');
const dialog=document.querySelector('#logoDialog');
let view='all';
for(const select of [left,right]) select.innerHTML=logos.map(logo=>`<option value="${logo.id}">${logo.id} · ${logo.title}</option>`).join('');
left.value='01';right.value='04';
function render(){
  const visible=view==='all'?logos:[logos.find(logo=>logo.id===left.value),logos.find(logo=>logo.id===right.value)];
  grid.classList.toggle('is-pair',view==='pair');
  grid.innerHTML=visible.map(logo=>`<article class="logo-card"><div class="card-top"><span class="number">${logo.id}</span><span class="kind">${logo.kind}</span></div><button type="button" class="art-button" data-logo="${logo.id}" aria-label="Enlarge ${logo.id}: ${logo.title}"><img src="${logo.src}" alt="${logo.title} logo" width="${logo.width}" height="${logo.height}"><span class="enlarge-hint" aria-hidden="true">↗</span></button><div class="card-copy"><h2>${logo.title}</h2><p>${logo.intent}</p></div></article>`).join('');
  status.textContent=view==='all'?'Showing all eight logo directions.':`Comparing ${visible[0].title} and ${visible[1].title}.`;
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  view=button.dataset.view;
  document.querySelectorAll('[data-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  document.querySelector('.pair-controls').hidden=view!=='pair';render();
}));
left.addEventListener('change',render);right.addEventListener('change',render);
document.querySelector('#swapLogos').addEventListener('click',()=>{const savedLeft=left.value;left.value=right.value;right.value=savedLeft;render();});
grid.addEventListener('click',event=>{
  const button=event.target.closest('[data-logo]');if(!button)return;
  const logo=logos.find(item=>item.id===button.dataset.logo);
  document.querySelector('#dialogNumber').textContent=`Direction ${logo.id} · ${logo.kind}`;
  document.querySelector('#dialogTitle').textContent=logo.title;
  document.querySelector('#dialogImage').src=logo.src;
  document.querySelector('#dialogImage').alt=`${logo.title} logo`;
  document.querySelector('#dialogIntent').textContent=logo.intent;
  document.querySelector('#dialogAsset').href=logo.src;
  dialog.showModal();
});
document.querySelector('#closeDialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
render();
