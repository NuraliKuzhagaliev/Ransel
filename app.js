'use strict';
const fleet = [
  {id:'loader',name:'Фронтальный погрузчик',model:'XCMG V330KZ',category:'Погрузочные работы',group:['earth'],crop:470,cropHeight:101,tags:['Погрузка','Планировка'],features:['Для строительных, дорожных и погрузочных работ','Высокая производительность','Надёжная конструкция','Универсальность применения']},
  {id:'backhoe',name:'Экскаватор-погрузчик',model:'XCMG XC8-S2570',category:'Земляные работы',group:['earth'],crop:577,cropHeight:102,tags:['3 в 1','Телескопическая стрела'],features:['Многофункциональность 3 в 1','Телескопическая стрела','Высокая маневренность','Для земляных, погрузочных и планировочных работ']},
  {id:'tractor',name:'Трактор с щёткой и отвалом',model:'YANMAR ZB 30 F1',category:'Коммунальные работы',group:['utility'],crop:695,cropHeight:115,tags:['Щётка','Передний отвал'],features:['Щёточное оборудование для очистки территорий','Передний отвал','Компактность и высокая эффективность','Для коммунальных и строительных работ']},
  {id:'pump',name:'Автобетононасос',model:'Mercedes-Benz Actros 4141 · Putzmeister M42',category:'Бетонирование',group:['concrete'],crop:817,cropHeight:106,tags:['Стрела 42 м','Putzmeister'],features:['Длина стрелы 42 метра','Высокая производительность','Для крупномасштабного бетонирования','Надёжность Putzmeister']},
  {id:'manipulator',name:'Манипулятор с люлькой',model:'MAN TGS 28.0 · КМУ ANTO MOTORS SOS 350',category:'Подъём и монтаж',group:['lifting'],crop:932,cropHeight:108,tags:['6,3 тонны','Высотные работы'],features:['Грузоподъёмность 6,3 тонны','Кран-манипулятор','Люлька для высотных работ','Для монтажных, строительных и обслуживающих работ']},
  {id:'water',name:'Водовоз / моечная машина',model:'КАМАЗ 65115 · автоцистерна',category:'Коммунальные работы',group:['utility'],crop:1048,cropHeight:105,tags:['Цистерна 10 м³','Полив и мойка'],features:['Объём цистерны 10 м³','Поливомоечное и асфальтомоечное оборудование','Для дорожных и коммунальных работ']},
  {id:'crane',name:'Автокран XCMG',model:'XCMG QY25K5S',category:'Подъём и монтаж',group:['lifting'],crop:1157,cropHeight:106,tags:['25 тонн','Монтаж'],features:['Грузоподъёмность 25 тонн','Высокая надёжность','Удобство в эксплуатации','Для строительных и монтажных работ']}
];
const grid=document.querySelector('#equipment-grid');
const quoteDialog=document.querySelector('#quote-dialog');
const equipmentDialog=document.querySelector('#equipment-dialog');
const quoteSelect=document.querySelector('#quote-equipment');
const i18n=window.RanselI18n;
const t=source=>i18n.t(source);
let returnFocus=null;
let currentFilter='all';
let activeDetailId=null;
// Each card crops the same cached source image. Load it eagerly: the large negative
// crop offset can prevent WebKit's lazy loader from ever observing the image.
const equipmentImage=item=>`<div class="equipment-image" style="--crop-top:${-item.crop/item.cropHeight*100}%;aspect-ratio:210/${item.cropHeight}"><img src="assets/commercial-proposal.jpeg" width="1024" height="1536" alt="${t(item.name)} — ${t('изображение из коммерческого предложения')}" loading="eager" decoding="async"></div>`;

function applyFilter(animate=true){
  document.querySelectorAll('[data-filter]').forEach(button=>{const active=button.dataset.filter===currentFilter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  let count=0;
  [...grid.children].forEach(card=>{
    const visible=currentFilter==='all'||card.dataset.groups.split(' ').includes(currentFilter);
    card.hidden=!visible;card.classList.toggle('featured',currentFilter==='all'&&card===grid.firstElementChild);
    if(visible){card.style.animation='none';if(animate){void card.offsetWidth;card.style.animation='';card.style.animationDelay=`${count*45}ms`;}count++;}
  });
  document.querySelector('.catalog-count').textContent=i18n.count(count);
}
function renderFleet(){
  const selected=quoteSelect.value;
  grid.replaceChildren();
  quoteSelect.querySelectorAll('option:not(:first-child)').forEach(option=>option.remove());
  fleet.forEach((item,index)=>{
    const card=document.createElement('article');
    card.className='equipment-card'+(index===0?' featured':'');card.dataset.groups=item.group.join(' ');
    card.innerHTML=`<div class="equipment-stage"><span class="equipment-category">${t(item.category)}</span><span class="equipment-index">${String(index+1).padStart(2,'0')} / 07</span>${equipmentImage(item)}</div><div class="equipment-info"><h3>${t(item.name)}</h3><p class="equipment-model">${t(item.model)}</p><div class="equipment-specs">${item.tags.map(tag=>`<span>${t(tag)}</span>`).join('')}</div><div class="equipment-bottom"><p class="equipment-price">${t('Стоимость по запросу')}<small>${t('Условия под ваш объект')}</small></p><div class="card-actions"><button class="detail-button" data-detail="${item.id}" aria-label="${t('Характеристики')}: ${t(item.name)}" title="${t('Характеристики')}">+</button><button class="quote-card-button" data-quote="${item.id}" aria-label="${t('Рассчитать аренду')}: ${t(item.name)}" title="${t('Рассчитать аренду')}">↗</button></div></div></div>`;
    grid.append(card);
    const option=document.createElement('option');option.value=item.id;option.textContent=`${t(item.name)} · ${t(item.model)}`;quoteSelect.append(option);
  });
  quoteSelect.value=selected;applyFilter(false);
}
renderFleet();
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{currentFilter=button.dataset.filter;applyFilter();}));

const themeButton=document.querySelector('.theme-toggle');
function updateThemeButton(){
  const dark=document.documentElement.dataset.theme==='dark';
  themeButton.setAttribute('aria-pressed',String(dark));themeButton.setAttribute('aria-label',t(dark?'Включить светлую тему':'Включить тёмную тему'));themeButton.title=t(dark?'Светлая тема':'Тёмная тема');
  document.querySelector('meta[name="theme-color"]').content=dark?'#101719':'#f5f3ee';
}
themeButton.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('ransel-theme',next)}catch(e){}updateThemeButton();});updateThemeButton();
const menuButton=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('#mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label',t('Открыть меню'));}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';mobileNav.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',t(open?'Закрыть меню':'Открыть меню'));});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileNav.hidden){closeMenu();menuButton.focus();}});
window.matchMedia('(min-width:1201px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

function openQuote(id){closeMenu();if(equipmentDialog.open)equipmentDialog.close();quoteSelect.value=fleet.some(item=>item.id===id)?id:'Нужна помощь с выбором';document.querySelector('#form-error').hidden=true;quoteDialog.showModal();}
function renderDetail(id){
  const item=fleet.find(v=>v.id===id);const index=fleet.indexOf(item)+1;
  document.querySelector('#detail-index').textContent=String(index).padStart(2,'0');
  document.querySelector('#equipment-detail').innerHTML=`<div class="equipment-stage detail-stage">${equipmentImage(item)}</div><h2 id="detail-title">${t(item.name)}</h2><p class="detail-model">${t(item.model)}</p><ul class="detail-features">${item.features.map(f=>`<li>${t(f)}</li>`).join('')}</ul><div class="detail-footer"><p><strong>${t('Стоимость по запросу')}</strong>${t('Срок, условия работ и локация объекта')}</p><button class="button primary" data-quote="${item.id}">${t('Рассчитать аренду')} <span>↗</span></button></div><p class="dialog-image-note">${t('Характеристики и изображение — из коммерческого предложения. Наличие и комплектация уточняются при заказе.')}</p>`;
}
document.addEventListener('click',event=>{
  const quote=event.target.closest('[data-quote]');if(quote){returnFocus=quote;openQuote(quote.dataset.quote);return;}
  const detail=event.target.closest('[data-detail]');if(detail){returnFocus=detail;activeDetailId=detail.dataset.detail;renderDetail(activeDetailId);equipmentDialog.showModal();}
});
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
  dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]')&&returnFocus?.isConnected&&!returnFocus.closest('dialog'))returnFocus.focus({preventScroll:true});});
});
const quoteForm=document.querySelector('#quote-form');
const startInput=quoteForm.elements.start;const endInput=quoteForm.elements.end;
const today=new Date();const todayLocal=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
startInput.min=todayLocal;endInput.min=todayLocal;
startInput.addEventListener('change',()=>{endInput.min=startInput.value||todayLocal;});
function prepareMessage(){
  const data=new FormData(quoteForm);const item=fleet.find(i=>i.id===data.get('equipment'));
  const formatDate=value=>value?new Intl.DateTimeFormat({ru:'ru-RU',en:'en-GB',kk:'kk-KZ'}[i18n.language]).format(new Date(value+'T12:00:00')):'';
  const lines=[t('Здравствуйте! Интересует аренда спецтехники Ransel Design.')];
  if(data.get('name').trim())lines.push(`${t('Имя')}: ${data.get('name').trim()}`);
  lines.push(`${t('Техника')}: ${item?t(item.name)+' — '+t(item.model):t('Нужна помощь с выбором')}`);
  lines.push(`${t('Город / объект')}: ${data.get('city').trim()}`);
  if(data.get('start'))lines.push(`${t('Начало')}: ${formatDate(data.get('start'))}`);
  if(data.get('end'))lines.push(`${t('Окончание')}: ${formatDate(data.get('end'))}`);
  if(data.get('task').trim())lines.push(`${t('Задача')}: ${data.get('task').trim()}`);
  lines.push(t('Подскажите, пожалуйста, наличие и стоимость.'));
  return 'https://wa.me/77018155151?text='+encodeURIComponent(lines.join('\n'));
}
quoteForm.addEventListener('submit',event=>{
  event.preventDefault();const error=document.querySelector('#form-error');error.hidden=true;
  if(startInput.value&&endInput.value&&endInput.value<startInput.value){error.textContent=t('Дата окончания должна быть не раньше начала аренды.');error.hidden=false;endInput.focus();return;}
  if(!quoteForm.elements.city.value.trim()){error.textContent=t('Укажите город или расположение объекта.');error.hidden=false;quoteForm.elements.city.focus();return;}
  window.open(prepareMessage(),'_blank','noopener,noreferrer');
});
quoteForm.elements.city.addEventListener('invalid',()=>quoteForm.elements.city.setCustomValidity(t('Укажите город или расположение объекта.')));
quoteForm.elements.city.addEventListener('input',()=>quoteForm.elements.city.setCustomValidity(''));
document.addEventListener('ransel:languagechange',()=>{
  renderFleet();updateThemeButton();menuButton.setAttribute('aria-label',t(mobileNav.hidden?'Открыть меню':'Закрыть меню'));
  quoteForm.elements.city.setCustomValidity('');document.querySelector('#form-error').hidden=true;
  if(activeDetailId&&equipmentDialog.open)renderDetail(activeDetailId);
});
if('IntersectionObserver'in window){document.documentElement.classList.add('js');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}

