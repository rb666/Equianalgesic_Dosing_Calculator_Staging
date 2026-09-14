'use strict';
(async()=>{
  const logos=window.logoPreviewCatalog;
  if(!Array.isArray(logos)||!logos.length) throw new Error('Logo catalog unavailable');
  const winners=logos.filter(logo=>logo.winner===true);
  const label=logo=>logo.winner?'Winner':logo.kind;
  const grid=document.querySelector('#logoGrid');
  const status=document.querySelector('#comparisonStatus');
  const left=document.querySelector('#leftLogo');
  const right=document.querySelector('#rightLogo');
  const dialog=document.querySelector('#logoDialog');
  const siteBase=new URL(document.querySelector('.studio').dataset.siteUrl,window.location.href);
  const siteUrl=logo=>{const url=new URL(siteBase);url.searchParams.set('logo',logo.id);return url.href;};
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const requestedView=new URL(window.location.href).searchParams.get('view');
  let view=['all','winners','pair'].includes(requestedView)?requestedView:'all';
  const artwork=logo=>{
    const b=logo.bounds;
    const styles=`--art-ratio:${b.width/b.height};--compact-scale:${logo.compactScale||1};--width-per-letter:${b.width/(logo.wordmarkHeight||b.height)};--source-width:${logo.width/b.width*100}%;--source-height:${logo.height/b.height*100}%;--source-left:${-b.x/b.width*100}%;--source-top:${-b.y/b.height*100}%`;
    return `<span class="artwork${logo.reference?' is-reference':''}${logo.compact?' is-compact':''}${logo.transparent?' is-transparent':''}${logo.file.endsWith('.svg')?' is-native':''}" style="${styles}"><img src="${escape(logo.src)}" alt="${escape(logo.title)} logo" width="${logo.width}" height="${logo.height}"></span>`;
  };
  for(const select of [left,right]) select.innerHTML=logos.map(logo=>`<option value="${logo.id}">${logo.id} · ${escape(logo.title)}</option>`).join('');
  document.querySelector('[data-view="all"]').textContent=`All concepts (${logos.length})`;
  document.querySelector('[data-view="winners"]').textContent=`Winners (${winners.length})`;
  document.querySelector('[data-view="winners"]').disabled=winners.length===0;
  document.querySelector('#winnerSummary').textContent=`Selected logos: ${winners.map(logo=>`#${logo.id}`).join(', ')}`;
  document.querySelectorAll('[data-view]').forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.view===view)));
  document.querySelector('.pair-controls').hidden=view!=='pair';
  left.value='04';right.value='03';
  function render(){
    const visible=view==='pair'?[logos.find(logo=>logo.id===left.value),logos.find(logo=>logo.id===right.value)]:view==='winners'?winners:logos;
    grid.classList.toggle('is-pair',view==='pair');
    grid.innerHTML=visible.map(logo=>`<article class="logo-card${logo.winner?' is-winner':''}"><div class="card-top"><span class="number">${logo.id}</span><span class="kind">${escape(label(logo))}</span></div><button type="button" class="art-button" data-logo="${logo.id}" aria-label="Enlarge ${logo.id}: ${escape(logo.title)}">${artwork(logo)}<span class="enlarge-hint" aria-hidden="true">↗</span></button><div class="small-rendition"><span class="small-label">At a small size</span><div class="small-art" aria-hidden="true">${artwork(logo)}</div></div><div class="card-copy"><h2>${escape(logo.title)}</h2><p>${escape(logo.intent)}</p><a class="card-site-link" href="${escape(siteUrl(logo))}" aria-label="Try ${logo.id}: ${escape(logo.title)} on the site">Try on the site <span aria-hidden="true">→</span></a></div></article>`).join('');
    status.textContent=view==='pair'?`Comparing ${visible[0].title} and ${visible[1].title}.`:view==='winners'?`Showing your ${winners.length} winners in your order: ${winners.map(logo=>logo.id).join(', ')}.`:`Showing all ${logos.length} logos in the current comparison.`;
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
    document.querySelector('#dialogNumber').textContent=`Direction ${logo.id} · ${label(logo)}`;
    document.querySelector('#dialogTitle').textContent=logo.title;
    document.querySelector('#dialogArt').innerHTML=artwork(logo);
    document.querySelector('#dialogIntent').textContent=logo.intent;
    document.querySelector('#dialogAsset').href=logo.src;
    document.querySelector('#dialogSite').href=siteUrl(logo);
    const extension=logo.file.match(/\.[a-z0-9]+$/i)?.[0].toLowerCase()||'.png';
    const slug=logo.title.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'logo';
    document.querySelector('#dialogAsset').download=`${logo.id}-${slug}${extension}`;
    dialog.showModal();
  });
  document.querySelector('#closeDialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
  render();
})().catch(error=>{document.querySelector('#comparisonStatus').textContent='The logo comparison could not load. Refresh to try again.';document.querySelector('#comparisonStatus').classList.remove('sr-only');console.error(error);});
