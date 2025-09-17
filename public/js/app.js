// Minimal modular JS for the trainer page
const state = {
  mode: 'de->en',
  shuffle: true,
  topic: 'all',
  idx: 0,
  items: [],
  filtered: [],
  pairs: [],
  show: false,
};

function normalize(s){
  return s.toLowerCase().trim()
    .replace(/[.,!?;:()\[\]"'«»„“”‚’]/g,"")
    .replace(/\s+/g," ");
}

function lemmatizeDe(s){
  const map = new Map(Object.entries({
    "bin":"sein","bist":"sein","ist":"sein","sind":"sein","seid":"sein","sein":"sein",
    "habe":"haben","hast":"haben","hat":"haben","haben":"haben","habt":"haben",
    "kann":"können","kannst":"können","können":"können","könnt":"können",
    "will":"wollen","willst":"wollen","wollen":"wollen","wollt":"wollen",
    "muss":"müssen","musst":"müssen","müssen":"müssen","müsst":"müssen",
    "darf":"dürfen","darfst":"dürfen","dürfen":"dürfen","dürft":"dürfen",
    "soll":"sollen","sollst":"sollen","sollen":"sollen","sollt":"sollen",
    "mag":"mögen","magst":"mögen","mögen":"mögen","mögt":"mögen",
    "sie":"pron","du":"pron","ihr":"pron","er":"pron","es":"pron","wir":"pron"
  }));
  return normalize(s).split(" ").map(t=>map.get(t)||t).join(" ");
}

function scoreOne(a,b,lang){
  const norm = lang==='de'? lemmatizeDe : normalize;
  const A = norm(a), B = norm(b);
  if(!A.length) return 0;
  const aT = new Set(A.split(" "));
  const bT = new Set(B.split(" "));
  const inter = [...aT].filter(x=>bT.has(x)).length;
  const union = new Set([...aT,...bT]).size;
  const jacc = union ? inter/union : 0;
  const coverage = bT.size ? inter/bT.size : 0;
  return 0.7*jacc + 0.3*coverage;
}

function scoreAnswer(input, targets, lang){
  const arr = Array.isArray(targets) ? targets : [targets];
  return Math.max(...arr.map(t => scoreOne(input, t, lang)));
}

function shuffleArray(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function applyFilter(){
  const topic = state.topic;
  state.filtered = topic==='all' ? state.pairs : state.pairs.filter(p => p.topic === topic);
  state.items = state.shuffle ? shuffleArray(state.filtered) : state.filtered.slice();
  state.idx = 0;
}

function currentItem(){
  const len = Math.max(1, state.items.length);
  return state.items[state.idx % len] || { de:'', en:'' };
}

function render(){
  const topicSel = document.getElementById('topicSelect');
  const progress = document.getElementById('progress');
  const sourceText = document.getElementById('sourceText');
  const answer = document.getElementById('answer');
  const status = document.getElementById('status');
  const reveal = document.getElementById('reveal');
  const modeDeEn = document.getElementById('modeDeEn');
  const modeEnDe = document.getElementById('modeEnDe');
  const shuffleBtn = document.getElementById('shuffleBtn');

  const it = currentItem();
  const source = state.mode==='de->en' ? it.de : it.en;
  const targets = state.mode==='de->en' ? (it.enVariants || [it.en]) : (it.deVariants || [it.de]);
  const lang = state.mode==='de->en' ? 'en' : 'de';

  sourceText.textContent = source || '—';

  const s = scoreAnswer(answer.value, targets, lang);
  status.innerHTML = answer.value
    ? (s>=0.8 ? '<span class="ok">✓ Looks good</span>' : '<span class="bad">✗ Not quite</span>')
    : '';

  reveal.style.display = state.show ? 'block' : 'none';
  reveal.textContent = state.show ? ('Correct: ' + (targets||[]).join(' / ')) : '';

  progress.textContent = `${(state.idx % Math.max(1,state.items.length))+1} / ${state.items.length}`;

  // mode buttons
  modeDeEn.classList.toggle('active', state.mode==='de->en');
  modeEnDe.classList.toggle('active', state.mode==='en->de');
  shuffleBtn.textContent = state.shuffle ? 'Shuffled' : 'In order';

  // topics
  if (topicSel && !topicSel.dataset.ready) {
    const topics = ['all', ...Array.from(new Set(state.pairs.map(p=>p.topic).filter(Boolean)))];
    topicSel.innerHTML = topics.map(t=>`<option value="${t}">${t}</option>`).join('');
    topicSel.value = state.topic;
    topicSel.dataset.ready = '1';
  }
}

async function loadPairs(){
  // Works whether site is at / or /a2-trainer-php
  const url = `${window.APP_BASE}/data/spektrum_a2_pairs_clean.json`;
  const res = await fetch(url, { cache: 'no-store' });
  if(!res.ok){ throw new Error('Failed to load dataset: ' + res.status); }
  state.pairs = await res.json();
  applyFilter();
  render();
}


function bindEvents(){
  const topicSel = document.getElementById('topicSelect');
  const answer = document.getElementById('answer');
  const showBtn = document.getElementById('showBtn');
  const nextBtn = document.getElementById('nextBtn');
  const resetBtn = document.getElementById('resetBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const modeDeEn = document.getElementById('modeDeEn');
  const modeEnDe = document.getElementById('modeEnDe');

  topicSel.addEventListener('change', e => { state.topic = e.target.value; applyFilter(); render(); });
  answer.addEventListener('input', () => render());
  showBtn.addEventListener('click', () => { state.show = !state.show; render(); });
  nextBtn.addEventListener('click', () => { state.idx++; state.show=false; answer.value=''; render(); });
  resetBtn.addEventListener('click', () => { state.idx=0; state.show=false; answer.value=''; render(); });
  shuffleBtn.addEventListener('click', () => { state.shuffle=!state.shuffle; applyFilter(); render(); });
  modeDeEn.addEventListener('click', () => { state.mode='de->en'; render(); });
  modeEnDe.addEventListener('click', () => { state.mode='en->de'; render(); });
}

document.addEventListener('DOMContentLoaded', async () => {
  bindEvents();
  try { await loadPairs(); } catch (e) {
    console.error(e);
    // still render empty state
    render();
  }
});
