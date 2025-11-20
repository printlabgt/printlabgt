// Tabs, filtros simples y modal (mockup)
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const tabs = $$('.tab-btn');
const grids = $$('[data-grid]');
const search = $('#q');
const tag = $('#tag');
const reset = $('#reset');
const count = $('#count');
const empty = $('#empty');

function setActiveTab(key){
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === key));
  grids.forEach(g => g.classList.toggle('hidden', g.dataset.grid !== key));
  filter();
}

tabs.forEach(btn => btn.addEventListener('click', () => setActiveTab(btn.dataset.tab)));
setActiveTab('mdf');

function filter(){
  const q = (search?.value || '').toLowerCase().trim();
  const tagVal = (tag?.value || 'todas').toLowerCase();
  const activeGrid = grids.find(g => !g.classList.contains('hidden'));
  if(!activeGrid){ return; }
  const cards = Array.from(activeGrid.querySelectorAll('.card'));
  let shown = 0;
  cards.forEach(card => {
    const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
    const tags = (card.dataset.tags || '').toLowerCase();
    const inText = !q || title.includes(q) || tags.includes(q);
    const inTag = tagVal === 'todas' || tags.includes(tagVal);
    const ok = inText && inTag;
    card.style.display = ok ? '' : 'none';
    if(ok) shown++;
  });
  if(count) count.textContent = `${shown} resultado(s)`;
  if(empty) empty.classList.toggle('hidden', shown > 0);
}

search?.addEventListener('input', ()=> setTimeout(filter, 200));
tag?.addEventListener('change', filter);
reset?.addEventListener('click', ()=>{
  if(search) search.value = '';
  if(tag) tag.value = 'todas';
  filter();
});
filter();

// Modal
const modal = $('#modal');
const mImg = $('#mImg');
const mTitle = $('#mTitle');
const mDesc = $('#mDesc');
const mTags = $('#mTags');
const mPdf = $('#mPdf');
const mModel = $('#mModel');
const btnClose = document.querySelector('.modal-close');

$$('.btn-detail').forEach(btn => {
  btn.addEventListener('click', ()=>{
    mTitle.textContent = btn.dataset.title || '';
    mDesc.textContent  = btn.dataset.desc || '';
    mTags.innerHTML    = (btn.dataset.tags || '').split(' ').map(t=>`<span>${t}</span>`).join(' ');
    if(btn.dataset.img) mImg.src = btn.dataset.img;
    if(btn.dataset.pdf){
      mPdf.href = btn.dataset.pdf;
      mPdf.style.display='inline-flex';
    } else {
      mPdf.style.display='none';
    }
    if(btn.dataset.model){
      mModel.href = btn.dataset.model;
      mModel.style.display='inline-flex';
    } else {
      mModel.style.display='none';
    }
    modal.classList.remove('hidden');
  });
});

btnClose?.addEventListener('click', ()=> modal.classList.add('hidden'));
modal?.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.add('hidden'); });

/* ===== LLAVEROS PERSONALIZADOS ===== */

const llaveroForm      = document.querySelector('#llaveroForm');
const nombreInput      = document.querySelector('#clienteNombre');
const whatsappInput    = document.querySelector('#clienteWhatsapp');
const cantidadInput    = document.querySelector('#llaveroCantidad');
const tamanoSelect     = document.querySelector('#llaveroTamano');
const formaSelect      = document.querySelector('#llaveroForma');
const colorSelect      = document.querySelector('#llaveroColor');

const textoFrontInput  = document.querySelector('#llaveroTextoFront');
const textoBackInput   = document.querySelector('#llaveroTextoBack');
const textoTamInput    = document.querySelector('#llaveroTextoTam');
const textoTamValor    = document.querySelector('#llaveroTextoTamValor');

const logoFrontInput   = document.querySelector('#llaveroLogoFront');
const logoBackInput    = document.querySelector('#llaveroLogoBack');
const logoTamInput     = document.querySelector('#llaveroLogoTam');
const logoTamValor     = document.querySelector('#llaveroLogoTamValor');

const notasInput       = document.querySelector('#llaveroNotas');
const precioTextoLabel = document.querySelector('#llaveroPrecioTexto');
const btnDescargar     = document.querySelector('#btnDescargarDiseno');

const previewFront     = document.querySelector('#previewFront');
const previewBack      = document.querySelector('#previewBack');
const previewTextFront = document.querySelector('#previewTextFront');
const previewTextBack  = document.querySelector('#previewTextBack');
const previewLogoFront = document.querySelector('#previewLogoFront');
const previewLogoBack  = document.querySelector('#previewLogoBack');
const tabsSide         = Array.from(document.querySelectorAll('.tab-side'));

let currentSide = 'front'; // 'front' o 'back'

/* formas y color */
function updateShape(){
  [previewFront, previewBack].forEach(box => {
    if(!box) return;
    box.classList.remove('llavero-shape-rect','llavero-shape-oval','llavero-shape-circle');
    const shape = formaSelect.value;
    if(shape === 'rect') box.classList.add('llavero-shape-rect');
    if(shape === 'oval') box.classList.add('llavero-shape-oval');
    if(shape === 'circle') box.classList.add('llavero-shape-circle');
  });
}
function updateColor(){
  [previewFront, previewBack].forEach(box => {
    if(!box) return;
    box.style.backgroundColor = colorSelect.value;
  });
}
formaSelect?.addEventListener('change', updateShape);
colorSelect?.addEventListener('change', updateColor);
updateShape();
updateColor();

/* precio estimado simple */
function calcularPrecioEstimado(){
  if(!cantidadInput || !tamanoSelect || !precioTextoLabel) return;
  const cantidad = parseInt(cantidadInput.value || '1', 10);
  const tamano   = tamanoSelect.value;
  let precioUnitario = 0;
  if(tamano === 'pequeño') precioUnitario = 25;
  else if(tamano === 'mediano') precioUnitario = 30;
  else if(tamano === 'grande') precioUnitario = 35;
  const total = precioUnitario * (isNaN(cantidad) ? 1 : cantidad);
  precioTextoLabel.textContent = `Precio estimado: Q${total.toFixed(2)} (Q${precioUnitario.toFixed(2)} c/u)`;
}
cantidadInput?.addEventListener('input', calcularPrecioEstimado);
tamanoSelect?.addEventListener('change', calcularPrecioEstimado);
calcularPrecioEstimado();

/* texto en vivo frente/reverso */
textoFrontInput?.addEventListener('input', () => {
  const v = textoFrontInput.value.trim();
  previewTextFront.textContent = v || 'Texto frente';
});
textoBackInput?.addEventListener('input', () => {
  const v = textoBackInput.value.trim();
  previewTextBack.textContent = v || 'Texto reverso';
});

/* tamaño de texto */
textoTamInput?.addEventListener('input', () => {
  const size = parseInt(textoTamInput.value || '18', 10);
  textoTamValor.textContent = `${size} px`;
  previewTextFront.style.fontSize = `${size}px`;
  previewTextBack.style.fontSize  = `${size}px`;
});
if(textoTamInput){
  const sizeInit = parseInt(textoTamInput.value || '18', 10);
  textoTamValor.textContent = `${sizeInit} px`;
  previewTextFront.style.fontSize = `${sizeInit}px`;
  previewTextBack.style.fontSize  = `${sizeInit}px`;
}

/* logos */
function loadLogo(input, imgEl){
  input?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if(!file){
      imgEl.src = '';
      imgEl.classList.add('hidden');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      imgEl.src = ev.target.result;
      imgEl.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });
}
loadLogo(logoFrontInput, previewLogoFront);
loadLogo(logoBackInput,  previewLogoBack);

function updateLogoSize(value){
  const v = parseInt(value || '80', 10);
  logoTamValor.textContent = `${v}%`;

  [previewLogoFront, previewLogoBack].forEach(img => {
    if (!img) return;
    img.style.width = `${v}%`;   // ancho relativo al llavero
    img.style.height = 'auto';   // que mantenga la proporción
  });
}

// Cuando mueven el slider
logoTamInput?.addEventListener('input', () => {
  updateLogoSize(logoTamInput.value);
});

// Tamaño inicial
if (logoTamInput) {
  updateLogoSize(logoTamInput.value);
}

/* Drag & drop genérico */
function makeDraggable(el, container){
  if(!el || !container) return;
  let isDown = false;
  let startX = 0, startY = 0;
  let origLeft = 0, origTop = 0;

  const start = (e) => {
    e.preventDefault();
    isDown = true;
    el.classList.add('dragging');
    const rect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = clientX;
    startY = clientY;
    origLeft = elRect.left - rect.left;
    origTop  = elRect.top  - rect.top;
  };
  const move = (e) => {
    if(!isDown) return;
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let newLeft = origLeft + (clientX - startX);
    let newTop  = origTop  + (clientY - startY);

    // limitar dentro del contenedor
    const maxLeft = rect.width  - el.offsetWidth;
    const maxTop  = rect.height - el.offsetHeight;
    if(newLeft < 0) newLeft = 0;
    if(newTop  < 0) newTop  = 0;
    if(newLeft > maxLeft) newLeft = maxLeft;
    if(newTop  > maxTop)  newTop  = maxTop;

    el.style.left = `${newLeft}px`;
    el.style.top  = `${newTop}px`;
    el.style.transform = 'translate(0,0)';
  };
  const end = () => {
    isDown = false;
    el.classList.remove('dragging');
  };

  el.addEventListener('mousedown', start);
  el.addEventListener('touchstart', start, {passive:false});
  window.addEventListener('mousemove', move);
  window.addEventListener('touchmove', move, {passive:false});
  window.addEventListener('mouseup', end);
  window.addEventListener('touchend', end);
}

makeDraggable(previewTextFront, previewFront);
makeDraggable(previewTextBack,  previewBack);
makeDraggable(previewLogoFront, previewFront);
makeDraggable(previewLogoBack,  previewBack);

/* Tabs frente / reverso */
tabsSide.forEach(btn => {
  btn.addEventListener('click', () => {
    const side = btn.dataset.side;
    currentSide = side;
    tabsSide.forEach(b => b.classList.toggle('active', b === btn));
    if(side === 'front'){
      previewFront.classList.remove('hidden');
      previewBack.classList.add('hidden');
    }else{
      previewBack.classList.remove('hidden');
      previewFront.classList.add('hidden');
    }
  });
});

/* Descargar diseño como JPG (lado activo) */
btnDescargar?.addEventListener('click', () => {
  const target = currentSide === 'front' ? previewFront : previewBack;
  if(!target){
    alert('No se encontró la vista previa.');
    return;
  }
  html2canvas(target, {backgroundColor:null}).then(canvas => {
    const link = document.createElement('a');
    link.download = `llavero-${currentSide}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  }).catch(() => {
    alert('No se pudo generar la imagen. Intenta nuevamente.');
  });
});

/* Enviar info por WhatsApp */
llaveroForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre   = (nombreInput?.value || '').trim();
  const whatsapp = (whatsappInput?.value || '').trim();
  const cantidad = parseInt(cantidadInput?.value || '1', 10);
  const tamano   = tamanoSelect?.value || '';
  const forma    = formaSelect?.value || '';
  const color    = colorSelect?.value || '';
  const textoF   = (textoFrontInput?.value || '').trim();
  const textoB   = (textoBackInput?.value || '').trim();
  const notas    = (notasInput?.value || '').trim();

  if(!nombre || !whatsapp){
    alert('Por favor ingresa tu nombre y tu número de WhatsApp.');
    return;
  }

  const tamanoLabel = tamanoSelect?.options[tamanoSelect.selectedIndex]?.text || tamano;
  const formaLabel  = formaSelect?.options[formaSelect.selectedIndex]?.text || forma;
  const colorLabel  = colorSelect?.options[colorSelect.selectedIndex]?.text || color;

  let precioUnitario = 0;
  if(tamano === 'pequeño') precioUnitario = 25;
  else if(tamano === 'mediano') precioUnitario = 30;
  else if(tamano === 'grande') precioUnitario = 35;
  const total = precioUnitario * (isNaN(cantidad) ? 1 : cantidad);

  const mensaje = [
    'Hola Print Lab, me gustaría cotizar un llavero personalizado en MDF.',
    '',
    'DATOS DEL CLIENTE',
    `- Nombre: ${nombre}`,
    `- WhatsApp de contacto: ${whatsapp}`,
    '',
    'DETALLE DEL PEDIDO',
    `- Cantidad: ${isNaN(cantidad) ? 1 : cantidad}`,
    `- Tamaño: ${tamanoLabel}`,
    `- Forma: ${formaLabel}`,
    `- Color base (aprox.): ${colorLabel}`,
    '',
    'DISEÑO FRENTE',
    `- Texto frente: ${textoF || '(sin texto)'}`,
    '',
    'DISEÑO REVERSO',
    `- Texto reverso: ${textoB || '(sin texto)'}`,
    '',
    'DETALLES ADICIONALES',
    `${notas || '(sin notas adicionales)'}`,
    '',
    'PRECIO ESTIMADO',
    `- Precio unitario estimado: Q${precioUnitario.toFixed(2)}`,
    `- Total estimado: Q${total.toFixed(2)}`,
    '',
    'IMPORTANTE:',
    'He descargado la imagen del diseño del llavero desde la página y la adjuntaré en este chat para que puedan verla con claridad.'
  ].join('\n');

  const numeroPrintLab = '50255322023'; // <-- pon aquí TU número sin + ni espacios
  const url = `https://wa.me/${numeroPrintLab}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
});


/* ===== FORMULARIO CONTACTO → WhatsApp + ANIMACIÓN ===== */

const contactForm    = document.querySelector('#contactForm');
const contactNombre  = document.querySelector('#contactNombre');
const contactEmail   = document.querySelector('#contactEmail');
const contactNumero   = document.querySelector('#contactNumero');
const contactTipo    = document.querySelector('#contactTipo');
const contactMensaje = document.querySelector('#contactMensaje');
const contactToast   = document.querySelector('#contactToast');

// Cambia este número por el de Print Lab si quieres uno diferente
// Debe ir SIN +, SIN espacios, solo código de país + número
const numeroPrintLabContacto = '50255322023';

function mostrarToast(){
  if(!contactToast) return;
  contactToast.classList.add('show');
  // Ocultar después de 4 segundos
  setTimeout(() => {
    contactToast.classList.remove('show');
  }, 4000);
}

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre  = (contactNombre?.value || '').trim();
  const email   = (contactEmail?.value || '').trim();
  const numero  = (contactNumero?.value || '').trim();
  const tipo    = (contactTipo?.value || '').trim();
  const resumen = (contactMensaje?.value || '').trim();

  if(!nombre || !email|| !numero || !tipo){
    alert('Por favor llena tu nombre, correo, numero telefonico y tipo de trabajo.');
    return;
  }

  const mensaje = [
    'Nuevo formulario de contacto desde la página web de Print Lab.',
    '',
    'DATOS DEL CLIENTE',
    `- Nombre: ${nombre}`,
    `- Correo: ${email}`,
    `- Numero: ${numero}`,
    '',
    'TIPO DE TRABAJO',
    `- Interés en: ${tipo}`,
    '',
    'DESCRIPCIÓN DEL PROYECTO',
    resumen || '(Sin descripción adicional)'
  ].join('\n');

  const url = `https://wa.me/${numeroPrintLabContacto}?text=${encodeURIComponent(mensaje)}`;

  // Mostrar animación
  mostrarToast();

  // Abrir WhatsApp en una nueva pestaña/ventana
  window.open(url, '_blank');

  // Opcional: limpiar el formulario
  contactForm.reset();
});

